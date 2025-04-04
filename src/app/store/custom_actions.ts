import { createAction } from "@reduxjs/toolkit";
import { CourseData } from "../../types";

// These actions aren't handled by a reducer. Instead, the video middleware
// handles them. Typically they trigger side-effects, then dispatch other
// actions

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
