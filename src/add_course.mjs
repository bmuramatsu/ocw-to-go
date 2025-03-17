import fs from "fs";
import JSZip from "jszip";

const path = process.argv[2];

const file = fs.readFileSync(path);

const zip = await new JSZip().loadAsync(file);

// COURSE INFO
const dataText = await zip.file("data.json").async("text");

const dataJSON = JSON.parse(dataText);

// topics are in a nested list for some reason
const topics = dataJSON.topics.flatMap((t) => t);

const instructors = dataJSON.instructors.map((i) => i.title);

const level = dataJSON.level[0];

const courseId = dataJSON.site_uid;
// remove preceding "./" if present. jszip doesn't handle it
const cardSrcPath = dataJSON.image_src.replace(/^\.\/?/, '');
const cardDestPath = `dist/images/course_cards/${courseId}.jpg`;

const cardImg = await zip.file(cardSrcPath).async("nodebuffer");

fs.writeFileSync(cardDestPath, cardImg);

console.log("Add the following to src/app/initial_course_list.ts after populating the file field");
console.log({
  id: courseId,
  name: dataJSON.course_title,
  topics,
  instructors,
  courseLevel: `${dataJSON.primary_course_number} | ${level}`,
  cardImg: `/images/course_cards/${courseId}.jpg`,
  imgAltText: dataJSON.course_image_metadata.image_metadata["image-alt"],
  file: "[upload to R2 bucket and put path here]",
});

// TODO FIND VIDEOS
