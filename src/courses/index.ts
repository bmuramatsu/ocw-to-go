import { CourseData, VideoData } from "../types";
import introCS from "./introduction-to-cs-and-programming-using-python.json";
import linearAlg from "./linear-algebra.json";
import creole from "./creole-languages-and-caribbean-identities.json";
import introCS2 from "./introduction-to-computer-science-and-programming-in-python.json";

type RawCourse = Omit<CourseData, "videos"> & {
  videoGroups: VideoGroup[];
};

type RawVideo = Omit<VideoData, "category">;

type VideoGroup = {
  category: string;
  videos: RawVideo[];
};

// This is the order courses will be displayed in the UI
export const RAW_COURSES: RawCourse[] = [introCS, linearAlg, introCS2, creole];
