// Shared types for the app are defined here

export type CourseData = {
  id: string;
  file: string;
  name: string;
  cardImg: string;
  imgAltText: string;
  courseNumber: string;
  courseLevel: string;
  category: string;
  instructors: string[];
  topics: string[];
  videos: VideoData[];
  downloadSize: number;
  diskSize: number;
  featured: boolean;
  description: string;
  descriptionHtml: string;
};

export type VideoData = {
  title: string;
  videoUrl: string;
  youtubeKey: string;
  contentLength: number;
  category: string;
  captionsFile: string | null;
  htmlFile: string;
};

export type CourseStatus = "none" | "downloading" | "preparing" | "ready";

export type UserCourse = {
  status: CourseStatus;
  downloadProgress: number;
  errorMessage?: string;
};

export const newUserCourse = (
  params: Partial<UserCourse> = {},
): UserCourse => ({
  status: "none",
  downloadProgress: 0,
  ...params,
});

export type UserCourses = Partial<{ [courseId: string]: UserCourse }>;

// This may have a download percentage in the future
export type UserVideo = {
  ready: boolean;
  errorMessage?: string;
};

export type UserVideos = Partial<{ [videoId: string]: UserVideo }>;

export type VideoQueueItem = {
  courseId: string;
  videoId: string;
};

export type VideoQueue = VideoQueueItem[];

// Types used for import courses from JSON files
type RawVideo = Omit<VideoData, "category">;

type VideoGroup = {
  category: string;
  videos: RawVideo[];
};

export type RawCourse = Omit<CourseData, "videos"> & {
  videoGroups: VideoGroup[];
};
