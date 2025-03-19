import { createAction } from "@reduxjs/toolkit";
import { CourseData } from "../../types";

// video middleware handles these actions
export const downloadCourseVideos = createAction<CourseData>(
  "downloads/courseVideos",
);
export const cancelCourseDownload = createAction<{ courseId: string }>(
  "downloads/cancelCourse",
);
