import fs from "fs";

const inputFile = "src/courses/index.txt";
const outputFile = "src/courses/index.ts";

const courses = fs
  .readFileSync(inputFile, "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

// Generate import statements and variable names
const imports = courses
  .map((filename, i) => {
    const varName = `course${i}`;
    return `import ${varName} from "./${filename}.json";`;
  })
  .join("\n");

// Generate the RAW_COURSES array
const varNames = courses.map((_, i) => `  course${i},`).join("\n");

const output = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
import { RawCourse } from "../types";
${imports}

export const RAW_COURSES: RawCourse[] = [
${varNames}
];
`;

// Write to output file
fs.writeFileSync(outputFile, output);
console.log(`Generated ${outputFile}`);
