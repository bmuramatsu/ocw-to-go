// This provides the list of available courses
import { CourseData } from "../types";
import introCS from "../courses/introduction-to-cs-and-programming-using-python.json";
import linearAlg from "../courses/linear-algebra.json";
import creole from "../courses/creole-languages-and-caribbean-identities.json";
import introCS2 from "../courses/introduction-to-computer-science-and-programming-in-python.json";

export const ALL_COURSES: CourseData[] = [introCS, linearAlg, introCS2, creole];

export const COURSES_BY_ID = ALL_COURSES.reduce<Record<string, CourseData>>(
  (acc, course) => {
    acc[course.id] = course;
    return acc;
  },
  {},
);
