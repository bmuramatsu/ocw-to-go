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

export type UserCourse = {
  // can this go?
  id: string;
  ready: boolean;
  // can this go or be consolidated
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

// TODO make this partial
export type UserCourses = Record<string, UserCourse | null>;

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
