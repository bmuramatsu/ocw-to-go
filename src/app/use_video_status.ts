import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store/store";
import { ALL_COURSES } from "./initial_course_list";
import { CourseVideos, VideoQueue } from "../types";

type VideoStatus = "none" | "downloading" | "waiting" | "ready" | "error";
export type FullUserVideo = {
  status: VideoStatus;
};
type AllVideoStatus = Partial<{
  [courseId: string]: Partial<{
    [videoId: string]: FullUserVideo;
  }>;
}>;

const selectQueue = (state: RootState) => state.user.videoQueue;
const selectUserVideos = (state: RootState) => state.user.userVideos;

export const selectAllVideoStatus = createSelector(
  [selectQueue, selectUserVideos],
  (queue, userVideos) => {
    const allVideoStatus: AllVideoStatus = {};

    ALL_COURSES.forEach((course) => {
      allVideoStatus[course.id] = {};
      const courseVideos = userVideos[course.id] || {};

      course.videos.forEach((video) => {
        allVideoStatus[course.id]![video.youtubeKey] = makeFullVideoStatus(
          courseVideos,
          queue,
          course.id,
          video.youtubeKey,
        );
      });
    });

    return allVideoStatus;
  },
);

export const selectCourseVideoStatus = createSelector(
  [selectAllVideoStatus, (_: RootState, courseId: string) => courseId],
  (allVideoStatus, courseId) => {
    return allVideoStatus[courseId] || {};
  },
);

export const selectVideoStatus = createSelector(
  [selectCourseVideoStatus, (_: RootState, _courseId: string, videoId: string) => videoId],
  (courseVideos, videoId): FullUserVideo => {
    return courseVideos[videoId] || { status: "none" };
  },
);

function makeFullVideoStatus(
  courseVideos: CourseVideos,
  queue: VideoQueue,
  courseId: string,
  videoId: string,
): FullUserVideo {
  const queueIndex = queue.findIndex(
    (item) => item.courseId === courseId && item.videoId === videoId,
  );

  if (queueIndex === 0) {
    return { status: "downloading" };
  } else if (queueIndex > 0) {
    return { status: "waiting" };
  }

  const userVideo = courseVideos[videoId];
  if (userVideo?.ready) {
    return { status: "ready" };
  }

  return { status: "none" };
}
