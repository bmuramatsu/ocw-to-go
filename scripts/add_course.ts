// This script takes a URL to a zip file as an argument, extracts the course
// data from it, and generates a JSON file for the course. It also adds the
// course card image to the project, and determines the size of each video in
// the course.
// Files should be uploaded to R2 before running the script
import fs from "fs";
import JSZip from "jszip";
import readline from "readline";
import makeCourseList from "./course_list_maker.ts";
import type { RawCourse, RawVideo, VideoGroup } from "../src/types";

const VIDEO_HOST = "https://ocw.mit.edu";

// Types for data.json files in the course zips
interface Instructor {
  title: string;
}

interface OCWDataJSON {
  course_title: string;
  course_image_metadata: {
    file: string;
    image_metadata: {
      "image-alt": string;
    };
  };
  image_src: string;
  topics: string[][];
  instructors: Instructor[];
  primary_course_number: string;
  level: string[];
  course_description: string;
  course_description_html: string;
}

interface OCWVideoDataJSON {
  resource_type: string;
  file?: string;
  archive_url?: string;
  title: string;
  youtube_key: string;
  learning_resource_types?: string[];
  captions_file: string | null;
}

interface VideoWithPath {
  dataPath: string;
  dataJSON: OCWVideoDataJSON;
}

interface CourseContent {
  dataJSON: OCWDataJSON;
  courseId: string;
  dataPaths: string[];
  diskSize: number;
}

interface DownloadResult {
  zip: JSZip;
  downloadSize: number;
}

async function downloadCourseZip(url: string): Promise<DownloadResult> {
  console.log(`Fetching course from URL: ${url}`);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${resp.status} ${resp.statusText}`,
    );
  }

  const downloadSize = parseInt(resp.headers.get("content-length") || "0");
  const zipFile = await resp.arrayBuffer();
  const zip = await new JSZip().loadAsync(zipFile);

  return { zip, downloadSize };
}

async function extractCourseImage(
  zip: JSZip,
  dataJSON: OCWDataJSON,
  courseId: string,
): Promise<void> {
  // remove preceding "./" if present. jszip doesn't handle it
  const imgLocalPath = dataJSON.image_src.replace(/^\.\/?/, "");
  const imgDestPath = `static/images/course_cards/${courseId}.jpg`;

  console.log(`Writing course image to ${imgDestPath}`);
  const imgFile = zip.file(imgLocalPath);
  if (!imgFile) {
    throw new Error(`Image file not found in zip: ${imgLocalPath}`);
  }
  const imgBlob = await imgFile.async("nodebuffer");
  fs.writeFileSync(imgDestPath, imgBlob);
}

async function analyzeCourseContent(zip: JSZip): Promise<CourseContent> {
  console.log("Analyzing course content");

  const dataFile = zip.file("data.json");
  if (!dataFile) {
    throw new Error("No data.json found in zip file");
  }
  const dataText = await dataFile.async("text");
  const dataJSON: OCWDataJSON = JSON.parse(dataText);

  // Extract course ID from the image path
  const imgGlobalPath = dataJSON.course_image_metadata.file;
  const match = imgGlobalPath.match(/\/courses\/(.*)\//);
  if (!match || !match[1]) {
    throw new Error(
      `Failed to get course ID from course image path: ${imgGlobalPath}`,
    );
  }
  const courseId = match[1];

  // Find all data.json files and calculate disk size
  const dataPaths: string[] = [];
  let diskSize = 0;

  zip.forEach((path, fileData) => {
    if (fileData.dir) return;
    // @ts-expect-error - accessing internal property for size
    const size = fileData._data?.uncompressedSize as number | undefined;
    if (size) diskSize += size;

    const fileName = path.split("/").pop();
    if (fileName === "data.json") {
      dataPaths.push(path);
    }
  });

  return { dataJSON, courseId, dataPaths, diskSize };
}

async function extractCourseVideos(
  zip: JSZip,
  dataPaths: string[],
): Promise<VideoGroup[]> {
  console.log("Extracting video information");

  // Collect all videos from the zip
  const allVideos: VideoWithPath[] = [];
  for (const dataPath of dataPaths) {
    const file = zip.file(dataPath);
    if (!file) continue;
    const data = await file.async("text");
    const videoDataJSON: OCWVideoDataJSON = JSON.parse(data);
    if (
      videoDataJSON.resource_type === "Video" &&
      (videoDataJSON.file || videoDataJSON.archive_url)
    ) {
      allVideos.push({ dataPath, dataJSON: videoDataJSON });
    }
  }

  // The same video can appear multiple times in a course with different
  // timestamps, so group by youtube_key
  const videosByKey = Object.groupBy(allVideos, (v) => v.dataJSON.youtube_key);
  const videoGroupsMap = new Map<string, RawVideo[]>();

  for (const youtubeKey in videosByKey) {
    const videos = videosByKey[youtubeKey];
    if (!videos) continue;

    const videoData = await processVideoGroup(videos);
    if (!videoData) continue;

    const { video, category } = videoData;
    if (videoGroupsMap.has(category)) {
      videoGroupsMap.get(category)!.push(video);
    } else {
      videoGroupsMap.set(category, [video]);
    }
  }

  // Put "Other" at the end
  const otherVideos = videoGroupsMap.get("Other");
  if (otherVideos) {
    videoGroupsMap.delete("Other");
    videoGroupsMap.set("Other", otherVideos);
  }

  // Sort videos within each group and build result
  const videoGroups: VideoGroup[] = [];
  for (const [category, videos] of videoGroupsMap) {
    videos.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true }),
    );
    videoGroups.push({ category, videos });
  }

  return videoGroups;
}

async function processVideoGroup(
  videos: VideoWithPath[],
): Promise<{ video: RawVideo; category: string } | null> {
  const first = videos[0].dataJSON;
  const singleVideo = videos.length === 1;

  // Not all videos have a 'file' entry
  const videoUrl = first.file ? VIDEO_HOST + first.file : first.archive_url;
  if (!videoUrl) {
    console.warn(`No video URL for ${first.title}, skipping`);
    return null;
  }

  // Fetch content length
  console.log(`Getting length for ${first.title} at ${videoUrl}`);
  const videoResp = await fetch(videoUrl, { method: "HEAD" });
  const contentLength = parseInt(
    videoResp.headers.get("content-length") || "0",
  );
  if (!contentLength) {
    console.warn(
      `No content-length for ${first.title} (${videoUrl}), skipping`,
    );
    return null;
  }

  // Determine category (applied inconsistently in source data)
  const allTypes = videos.flatMap(
    (v) => v.dataJSON.learning_resource_types || [],
  );
  const category = allTypes[0] || "Other";

  // Get video title
  let title: string;
  if (singleVideo) {
    title = first.title;
  } else {
    title = await fetchYouTubeTitle(first.youtube_key);
  }

  const video: RawVideo = {
    title,
    videoUrl,
    youtubeKey: first.youtube_key,
    contentLength,
    captionsFile: first.captions_file,
    htmlFiles: videos.map((v) => v.dataPath.replace("data.json", "index.html")),
  };

  return { video, category };
}

async function fetchYouTubeTitle(youtubeKey: string): Promise<string> {
  console.log(
    `Video ${youtubeKey} appears multiple times, fetching title from YouTube`,
  );
  const youtubeApiPath = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeKey}&format=json`;
  const youtubeData = (await fetch(youtubeApiPath).then((r) => r.json())) as {
    title: string;
  };
  console.log(`Got title from YouTube: ${youtubeData.title}`);
  return youtubeData.title;
}

function buildCourseData(
  content: CourseContent,
  url: string,
  downloadSize: number,
  category: string,
  videoGroups: VideoGroup[],
): RawCourse {
  const { dataJSON, courseId, diskSize } = content;

  return {
    id: courseId,
    name: dataJSON.course_title,
    category,
    topics: dataJSON.topics.flatMap((t) => t),
    instructors: dataJSON.instructors.map((i) => i.title),
    courseNumber: dataJSON.primary_course_number,
    courseLevel: dataJSON.level[0],
    cardImg: `/images/course_cards/${courseId}.jpg`,
    imgAltText: dataJSON.course_image_metadata.image_metadata["image-alt"],
    file: url,
    downloadSize,
    diskSize,
    description: dataJSON.course_description,
    descriptionHtml: dataJSON.course_description_html,
    videoGroups,
  };
}

function saveCourse(course: RawCourse): void {
  console.log(course);
  fs.writeFileSync(
    `src/courses/${course.id}.json`,
    JSON.stringify(course, null, 4),
  );

  const courses = fs.readFileSync("src/courses/index.txt", "utf-8").split("\n");
  if (courses.includes(course.id)) {
    console.log(`Course already in src/courses/index.txt, not adding`);
  } else {
    fs.appendFileSync("src/courses/index.txt", `\n${course.id}`);
    makeCourseList();
    console.log(`Course added to src/courses/index.ts`);
  }
}

async function getUserInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.error("Usage: npm run add_course <url-or-file>");
    process.exit(1);
  }

  // Parse input (URL or existing course JSON file)
  let url: string;
  let existingCourseJson: RawCourse | undefined;

  if (arg.startsWith("http")) {
    console.log(`Building new course from URL: ${arg}`);
    url = arg;
  } else {
    console.log(`Rebuilding existing course from file: ${arg}`);
    const file = fs.readFileSync(arg, "utf-8");
    existingCourseJson = JSON.parse(file) as RawCourse;
    url = existingCourseJson.file;
  }

  const { zip, downloadSize } = await downloadCourseZip(url);

  const content = await analyzeCourseContent(zip);

  await extractCourseImage(zip, content.dataJSON, content.courseId);

  const videoGroups = await extractCourseVideos(zip, content.dataPaths);

  // Get category (from existing course or user input)
  let category: string;
  if (existingCourseJson) {
    category = existingCourseJson.category;
    console.log(`Using existing category: ${category}`);
  } else {
    category = await getUserInput("Enter the category for this course: ");
  }

  const course = buildCourseData(
    content,
    url,
    downloadSize,
    category,
    videoGroups,
  );
  saveCourse(course);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
