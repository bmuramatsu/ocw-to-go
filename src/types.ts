export type CourseData = {
  id: string;
  file: string;
  name: string;
  cardImg: string;
  courseLevel: string;
  instructors: string[];
  topics: string[];
};

export type UserCourse = {
  id: string;
  ready: boolean;
  status: string;
  videos: Video[];
};

export const newUserCourse = (
  courseId: string,
  params: Partial<UserCourse> = {},
): UserCourse => ({
  id: courseId,
  ready: false,
  status: "",
  videos: [],
  ...params,
});

export type UserCourses = Record<string, UserCourse | null>;

export type Video = {
  url: string;
  courseId: string;
};

export type VideoTextStatus = "unstarted" | "downloading" | "complete";

export type VideoStatus = {
  status: VideoTextStatus;
  total: number;
  finished: number;
};

export type VideoStatusMap = {
  [courseId: string]: VideoStatus | null;
};
