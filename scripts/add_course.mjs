// This script takes a URL to a zip file as an argument, extracts the course
// data from it, and generates a JSON file for the course.  It also adds the
// course card image to the project, and determines the size of each video in
// the course.
// Files should be uploaded to R2 before running the script
import fs from "fs";
import JSZip from "jszip";
import makeCourseList from "./course_list_maker.mjs";
import readline from "readline";

export const VIDEO_HOST = "https://ocw.mit.edu";

// eslint assumes this is running in the browser
// eslint-disable-next-line no-undef
const arg = process.argv[2];

let url;
let existingCourseJson;
if (arg.startsWith("http")) {
  console.log(`Building new course from URL: ${arg}`);
  url = arg;
} else {
  console.log(`Rebuilding existing course from file: ${arg}`);
  const file = fs.readFileSync(arg, "utf-8");
  existingCourseJson = JSON.parse(file);
  url = existingCourseJson.file;
}

console.log(`Fetching course from URL: ${url}`);
const resp = await fetch(url);
if (!resp.ok) {
  throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);
}

const zipFile = await resp.arrayBuffer();

const zip = await new JSZip().loadAsync(zipFile);

// COURSE INFO
const dataText = await zip.file("data.json").async("text");

const dataJSON = JSON.parse(dataText);

// This is the ID you use to reach the course on the site, it's it's more readable than the site_uid
let courseId;
const imgGlobalPath = dataJSON.course_image_metadata.file;
const match = imgGlobalPath.match(/\/courses\/(.*)\//);
if (match && match[1]) {
  courseId = match[1];
} else {
  throw new Error(
    `Failed to get course ID from course image path: ${imgGlobalPath}`,
  );
}

// remove preceding "./" if present. jszip doesn't handle it
const imgLocalPath = dataJSON.image_src.replace(/^\.\/?/, "");
const imgDestPath = `static/images/course_cards/${courseId}.jpg`;

console.log(`Writing course image to ${imgDestPath}`);
const imgBlob = await zip.file(imgLocalPath).async("nodebuffer");

fs.writeFileSync(imgDestPath, imgBlob);

console.log("Analyzing course content");
const dataPaths = [];
let diskSize = 0;

zip.forEach((path, fileData) => {
  if (fileData.dir) return;
  const size = fileData._data.uncompressedSize;
  if (size) diskSize += size;

  const fileName = path.split("/").pop();
  if (fileName === "data.json") {
    dataPaths.push(path);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

let category;
if (existingCourseJson) {
  category = existingCourseJson.category;
  console.log(`Using existing category: ${category}`);
} else {
  category = await getUserInput("Enter the category for this course: ");
}

const cardData = {
  id: courseId,
  name: dataJSON.course_title,
  category,
  // topics are in a nested list for some reason
  topics: dataJSON.topics.flatMap((t) => t),
  instructors: dataJSON.instructors.map((i) => i.title),
  courseNumber: dataJSON.primary_course_number,
  courseLevel: dataJSON.level[0],
  cardImg: `/images/course_cards/${courseId}.jpg`,
  imgAltText: dataJSON.course_image_metadata.image_metadata["image-alt"],
  file: url,
  downloadSize: parseInt(resp.headers.get("content-length")),
  diskSize,
  description: dataJSON.course_description,
  descriptionHtml: dataJSON.course_description_html,
  videoGroups: [],
};

// use a Map because it maintains insertion order
const allVideos = [];

for (const dataPath of dataPaths) {
  const data = await zip.file(dataPath).async("text");
  const dataJSON = JSON.parse(data);
  if (
    dataJSON["resource_type"] === "Video" &&
    (dataJSON["file"] || dataJSON["archive_url"])
  ) {
    allVideos.push({ dataPath, dataJSON });
  }
}

const videosByKey = Object.groupBy(allVideos, (v) => v.dataJSON.youtube_key);
const videoGroups = new Map();

for (const youtubeKey in videosByKey) {
  const videos = videosByKey[youtubeKey];
  const first = videos[0].dataJSON;
  const singleVideo = videos.length === 1;

  // not all videos have a 'file' entry.
  const videoUrl = first.file ? VIDEO_HOST + first.file : first.archive_url;

  console.log(`getting length for ${first.title}`);
  const resp = await fetch(videoUrl, { method: "HEAD" });
  const length = parseInt(resp.headers.get("content-length"));
  if (!length) {
    console.warn(
      `No content-length for ${first.title} (${videoUrl}), skipping`,
    );
    continue;
  }
  // these seem to be applied very inconsistently
  const allTypes = videos.flatMap((v) => v.dataJSON["learning_resource_types"]);
  const category = allTypes[0] || "Other";

  let title;
  if (singleVideo) {
    title = first.title;
  } else {
    console.log(
      `Video ${youtubeKey} appears multiple times, fetching title from YouTube`,
    );
    const youtubeApiPath = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${first.youtube_key}&format=json`;
    const youtubeData = await fetch(youtubeApiPath).then((r) => r.json());
    console.log(`Got title from YouTube: ${youtubeData.title}`);
    title = youtubeData.title;
  }

  const videoData = {
    title,
    videoUrl,
    youtubeKey: first["youtube_key"],
    contentLength: length,
    // From what I've seen, the videos use different caption files, but the
    // contents are identical
    captionsFile: first["captions_file"],
    // This needs to be a list
    // also I've lost dataPath at this point
    htmlFile: videos.map((v) => v.dataPath.replace("data.json", "index.html")),
  };

  if (videoGroups.has(category)) {
    videoGroups.get(category).push(videoData);
  } else {
    videoGroups.set(category, [videoData]);
  }
}

// Put "Other" at the end
const otherVideos = videoGroups.get("Other");
if (otherVideos) {
  videoGroups.delete("Other");
  videoGroups.set("Other", otherVideos);
}

for (const [category, videos] of videoGroups) {
  videos.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { numeric: true }),
  );

  cardData.videoGroups.push({
    category,
    videos,
  });
}

const safeName = cardData.id;

console.log(cardData);
fs.writeFileSync(
  `src/courses/${safeName}.json`,
  JSON.stringify(cardData, null, 4),
);

const courses = fs.readFileSync("src/courses/index.txt", "utf-8").split("\n");
if (courses.includes(safeName)) {
  console.log(`Course already in src/courses/index.txt, not adding`);
} else {
  fs.appendFileSync("src/courses/index.txt", `\n${safeName}`);
  makeCourseList();
  console.log(`Course added to src/courses/index.ts`);
}

rl.close();
