import { createAction } from "@reduxjs/toolkit";
import { CourseData } from "../../types";

// video middleware handles these actions
export const downloadCourseVideos = createAction<CourseData>(
  "downloads/courseVideos",
);
export const downloadVideo = createAction<{
  courseId: string;
  videoId: string;
}>("downloads/video");
export const cancelCourseDownload = createAction<{ courseId: string }>(
  "downloads/cancelCourse",
);
export const cancelVideoDownload = createAction<{
  courseId: string;
  videoId: string;
}>("downloads/cancelVideo");
