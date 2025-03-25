// Shared types for the app are defined here

export type CourseData = {
  id: string;
  file: string;
  name: string;
  cardImg: string;
  imgAltText: string;
  courseLevel: string;
  instructors: string[];
  topics: string[];
  videos: VideoData[];
  downloadSize: number;
  diskSize: number;
};

export type VideoData = {
  title: string;
  videoUrl: string;
  youtubeKey: string;
  contentLength: number;
  categories: string[];
  captionsFile: string | null;
};

export type CourseStatus =
  | "none"
  | "downloading"
  | "preparing"
  | "ready"
  | "error";

export type UserCourse = {
  status: CourseStatus;
};

export const newUserCourse = (
  params: Partial<UserCourse> = {},
): UserCourse => ({
  status: "none",
  ...params,
});

export type UserCourses = Partial<{ [courseId: string]: UserCourse }>;

// This may have a download percentage in the future
export type UserVideo = {
  ready: boolean;
};

export type UserVideos = Partial<{ [videoId: string]: UserVideo }>;

export type VideoQueueItem = {
  courseId: string;
  videoId: string;
};

export type VideoQueue = VideoQueueItem[];
