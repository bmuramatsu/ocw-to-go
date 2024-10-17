export type Course = {
  id: string;
  file: string;
  name: string;
  ready: boolean;
  status: string;
  videos: string[];
}

export type Video = {
  url: string;
  courseId: string;
}

export type VideoStatus = {
  status: "unstarted" | "downloading" | "complete";
  total: number;
  finished: number;
}

export type VideoStatusMap = {
  [courseId: string]: VideoStatus | null;
}
