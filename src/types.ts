export type Course = {
  id: string;
  file: string;
  name: string;
}

export type CourseStatus = {
  id: string;
  ready: boolean;
  status: string;
  // videos: string[];
}

export type CourseStatusMap = {
  [courseId: string]: CourseStatus;
}

export type Video = {
  url: string;
  courseId: string;
}

export type VideoTextStatus = "unstarted" | "downloading" | "complete";

export type VideoStatus = {
  status: VideoTextStatus
  total: number;
  finished: number;
}

export type VideoStatusMap = {
  [courseId: string]: VideoStatus | null;
}
