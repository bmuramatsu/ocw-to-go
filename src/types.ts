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

export type UserCourses = Record<string, UserCourse | null>;

export type UserVideo = {
  ready: boolean;
}

export type CourseVideos = Record<string, UserVideo | null>
export type UserVideos = Record<string, CourseVideos | null>;

export type VideoQueueItem = {
  course: CourseData;
  video: VideoData;
};

export type VideoQueue = VideoQueueItem[];
