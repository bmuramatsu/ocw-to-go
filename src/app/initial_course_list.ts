// This provides the list of available courses
import { CourseData } from "../types";
import { RAW_COURSES } from "../courses";


// Transforms the courses as they appear in the JSON files into
// a more convenient format for the application.
export const ALL_COURSES: CourseData[] = RAW_COURSES.map((course) => {
  return {
    ...course,
    // flatten video list and add the category to each video, this is
    // more convenient for the application to use
    videos: course.videoGroups.flatMap((group) =>
      group.videos.map((video) => ({ ...video, category: group.category })),
    ),
  };
});

export const COURSES_BY_ID = ALL_COURSES.reduce<Record<string, CourseData>>(
  (acc, course) => {
    acc[course.id] = course;
    return acc;
  },
  {},
);
