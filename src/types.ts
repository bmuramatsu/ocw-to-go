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
};

export type VideoData = {
  title: string;
  videoUrl: string;
  youtubeKey: string;
  contentLength: number;
  categories: string[];
  captionsFile: string | null;
};

export type CourseStatus = "none" | "downloading" | "preparing" | "ready" | "error";

export type UserCourse = {
  status: CourseStatus;
};

export const newUserCourse = (
  params: Partial<UserCourse> = {},
): UserCourse => ({
  status: "none",
  ...params,
});

export type UserCourses = Partial<Record<string, UserCourse>>;

export type UserVideo = {
  ready: boolean;
}

export type CourseVideos = Partial<Record<string, UserVideo>>;
export type UserVideos = Partial<Record<string, CourseVideos>>;

export type VideoQueueItem = {
  courseId: string;
  videoId: string;
};

export type VideoQueue = VideoQueueItem[];
