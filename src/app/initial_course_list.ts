// This provides the list of available courses
import { CourseData, VideoData } from "../types";
import introCS from "../courses/introduction-to-cs-and-programming-using-python.json";
import linearAlg from "../courses/linear-algebra.json";
import creole from "../courses/creole-languages-and-caribbean-identities.json";
import introCS2 from "../courses/introduction-to-computer-science-and-programming-in-python.json";

type RawCourse = Omit<CourseData, "videos"> & {
  videoGroups: VideoGroup[];
};

type RawVideo = Omit<VideoData, "category">;

type VideoGroup = {
  category: string;
  videos: RawVideo[];
};

export const RAW_COURSES: RawCourse[] = [introCS, linearAlg, introCS2, creole];

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
