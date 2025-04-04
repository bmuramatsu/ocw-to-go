// This script takes a URL to a zip file as an argument, extracts the course
// data from it, and generates a JSON file for the course.  It also adds the
// course card image to the project, and determines the size of each video in
// the course.
// Files should be uploaded to R2 before running the script
import fs from "fs";
import JSZip from "jszip";

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

const courseId = dataJSON.site_uid;
// remove preceding "./" if present. jszip doesn't handle it
const cardSrcPath = dataJSON.image_src.replace(/^\.\/?/, "");
const cardDestPath = `dist/images/course_cards/${courseId}.jpg`;

const cardImg = await zip.file(cardSrcPath).async("nodebuffer");

fs.writeFileSync(cardDestPath, cardImg);

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
  videos: [],
};

for (const dataPath of dataPaths) {
  const data = await zip.file(dataPath).async("text");
  const dataJSON = JSON.parse(data);

  if (
    dataJSON["resource_type"] === "Video" &&
    (dataJSON["file"] || dataJSON["archive_url"]) &&
    !cardData.videos.some((v) => v.youtubeKey === dataJSON.youtube_key)
  ) {
    console.log(`getting length for ${dataJSON.title}`);
    const videoUrl = dataJSON["file"]
      ? VIDEO_HOST + dataJSON["file"]
      : dataJSON["archive_url"];

    const resp = await fetch(videoUrl, { method: "HEAD" });
    const length = parseInt(resp.headers.get("content-length"));

    cardData.videos.push({
      title: dataJSON.title,
      videoUrl,
      youtubeKey: dataJSON["youtube_key"],
      contentLength: length,
      // these seem to be applied very inconsistently
      categories: dataJSON["learning_resource_types"],
      captionsFile: dataJSON["captions_file"],
    });
  }
}

cardData.videos.sort((a, b) =>
  a.title.localeCompare(b.title, undefined, { numeric: true }),
);

const safeName = cardData.name
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
  .replace(/-+/g, "-") // Collapse multiple hyphens
  .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

console.log(cardData);
fs.writeFileSync(
  `src/courses/${safeName}.json`,
  JSON.stringify(cardData, null, 4),
);

console.log(
  `wrote src/courses/${safeName}.json, please review and import into src/app/initial_course_list.ts`,
);
