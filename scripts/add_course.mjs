// This script takes a URL to a zip file as an argument, extracts the course
// data from it, and generates a JSON file for the course.  It also adds the
// course card image to the project, and determines the size of each video in
// the course.
// Files should be uploaded to R2 before running the script
import fs from "fs";
import JSZip from "jszip";
import makeCourseList from "./course_list_maker.mjs";

export const VIDEO_HOST = "https://ocw.mit.edu";

// eslint assumes this is running in the browser
// eslint-disable-next-line no-undef
const url = process.argv[2];
const resp = await fetch(url);
if (!resp.ok) {
  throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);
}

const zipFile = await resp.arrayBuffer();
const downloadSize = resp.headers.get("content-length");

const zip = await new JSZip().loadAsync(zipFile);

// COURSE INFO
const dataText = await zip.file("data.json").async("text");

const dataJSON = JSON.parse(dataText);

// topics are in a nested list for some reason
const topics = dataJSON.topics.flatMap((t) => t);

const instructors = dataJSON.instructors.map((i) => i.title);

const level = dataJSON.level[0];

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
const imgDestPath = `dist/images/course_cards/${courseId}.jpg`;

const imgBlob = await zip.file(imgLocalPath).async("nodebuffer");

fs.writeFileSync(imgDestPath, imgBlob);

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

const cardData = {
  id: courseId,
  name: dataJSON.course_title,
  topics,
  instructors,
  courseLevel: `${dataJSON.primary_course_number} | ${level}`,
  cardImg: `/images/course_cards/${courseId}.jpg`,
  imgAltText: dataJSON.course_image_metadata.image_metadata["image-alt"],
  file: url,
  downloadSize: parseInt(downloadSize),
  diskSize,
  videoGroups: [],
};

// use a Map because it maintains insertion order
const videoGroups = new Map();
const knownVideos = [];

for (const dataPath of dataPaths) {
  const data = await zip.file(dataPath).async("text");
  const dataJSON = JSON.parse(data);

  if (
    dataJSON["resource_type"] === "Video" &&
    (dataJSON["file"] || dataJSON["archive_url"]) &&
    !knownVideos.includes(dataJSON.youtube_key)
  ) {
    knownVideos.push(dataJSON.youtube_key);
    console.log(`getting length for ${dataJSON.title}`);
    const videoUrl = dataJSON["file"]
      ? VIDEO_HOST + dataJSON["file"]
      : dataJSON["archive_url"];

    const resp = await fetch(videoUrl, { method: "HEAD" });
    const length = parseInt(resp.headers.get("content-length"));
    // these seem to be applied very inconsistently
    const category = dataJSON["learning_resource_types"][0] || "Other";

    const videoData = {
      title: dataJSON.title,
      videoUrl,
      youtubeKey: dataJSON["youtube_key"],
      contentLength: length,
      captionsFile: dataJSON["captions_file"],
      htmlFile: dataPath.replace("data.json", "index.html"),
    };

    if (videoGroups.has(category)) {
      videoGroups.get(category).push(videoData);
    } else {
      videoGroups.set(category, [videoData]);
    }
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

fs.appendFileSync("src/courses/index.txt", `${safeName}`);
makeCourseList();

console.log(`Course added to src/courses/index.ts`);
