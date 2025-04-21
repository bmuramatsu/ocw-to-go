// This provides the list of available courses
import { CourseData } from "../types";
import { RAW_COURSES } from "../courses";


export const ALL_COURSES: CourseData[] = RAW_COURSES.map((course) => {
  return {
    ...course,
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
