import fs from "fs";

export default function makeCourseList() {
  const inputFile = "src/courses/index.txt";
  const outputFile = "src/courses/index.ts";

  const courses = fs
    .readFileSync(inputFile, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const output = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// To edit the course list, modify src/courses/index.txt and
// run 'npm run make_course_list'.
// To add a new course, please reference README.md
import { RawCourse } from "../types";
${imports(courses)}

export const RAW_COURSES: RawCourse[] = [
${arrayItems(courses)}
];
`;

  // Write to output file
  fs.writeFileSync(outputFile, output);
  console.log(`Generated ${outputFile}`);
}

function imports(courses) {
  return courses
    .map((filename, i) => {
      const varName = `course${i}`;
      return `import ${varName} from "./${filename}.json";`;
    })
    .join("\n");
}

function arrayItems(courses) {
  return courses.map((_, i) => `  course${i},`).join("\n");
}
