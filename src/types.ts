export type Course = {
  id: string;
  file: string;
  name: string;
  ready: boolean;
  status: string;
  videos: string[];
  cardImg: string;
  courseLevel: string;
  instructors: string[];
  topics: string[];
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
