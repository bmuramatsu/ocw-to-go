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
};

export const newUserCourse = (
  courseId: string,
  params: Partial<UserCourse> = {},
): UserCourse => ({
  id: courseId,
  ready: false,
  status: "",
  ...params,
});

export type UserCourses = Record<string, UserCourse | null>;

export type RawVideo = {
  resource_type: "Video";
  file: string;
  youtube_key: string;
};

export type Video = {
  courseId: string;
  url: string;
  youtubeKey: string;
};

export type VideoTextStatus = "unstarted" | "downloading" | "complete";

export type VideoStatus = {
  courseId: string;
  status: VideoTextStatus;
  total: number;
  finished: number;
  videos: Video[];
};

export type VideoStatusMap = Record<string, VideoStatus | null>;
