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

// represents the video data as found in the zip file
export type RawVideo = {
  resource_type: "Video";
  file?: string;
  archive_url?: string;
  youtube_key: string;
};

export type Video = {
  courseId: string;
  url: string;
  youtubeKey: string;
};

export type CourseVideos = {
  courseId: string;
  total: number;
  finished: number;
  videos: Video[];
};

export const defaultVideos = (courseId: string): CourseVideos => ({
  courseId,
  total: 0,
  finished: 0,
  videos: [],
});

export type AllCourseVideos = Record<string, CourseVideos | null>;
