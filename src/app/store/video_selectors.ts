import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ALL_COURSES } from "../initial_course_list";
import { UserVideos, VideoQueue } from "../../types";

type VideoStatus = "none" | "downloading" | "waiting" | "ready" | "error";
export type FullUserVideo = {
  status: VideoStatus;
};
type AllVideoStatus = Partial<{
  [courseId: string]: Partial<{
    [videoId: string]: FullUserVideo;
  }>;
}>;

// The purpose of these redux selectors is to make it easier to access video
// state information. Both the UserVideo and VideoQueue store information
// about video status. These selectors combine that information to create a
// simpler and comprehensive view that can easily be viewed at course or individual
// video levels. Performing this combination in a selector also causes the data
// to only be recomputed when the relevant pieces of state change.

const selectQueue = (state: RootState) => state.user.videoQueue;
const selectUserVideos = (state: RootState) => state.user.userVideos;

export const selectAllVideoStatus = createSelector(
  [selectQueue, selectUserVideos],
  (queue, userVideos) => {
    const allVideoStatus: AllVideoStatus = {};

    ALL_COURSES.forEach((course) => {
      allVideoStatus[course.id] = {};
      course.videos.forEach((video) => {
        allVideoStatus[course.id]![video.youtubeKey] = makeFullVideoStatus(
          userVideos,
          queue,
          course.id,
          video.youtubeKey,
        );
      });
    });

    return allVideoStatus;
  },
);

// These functions let you drill further down into video status by course and
// video ids
export const selectCourseVideoStatus = createSelector(
  [selectAllVideoStatus, (_: RootState, courseId: string) => courseId],
  (allVideoStatus, courseId) => {
    return allVideoStatus[courseId] || {};
  },
);

export const selectVideoStatus = createSelector(
  [
    selectCourseVideoStatus,
    (_: RootState, _courseId: string, videoId: string) => videoId,
  ],
  (courseVideos, videoId): FullUserVideo => {
    return courseVideos[videoId] || { status: "none" };
  },
);

function makeFullVideoStatus(
  userVideos: UserVideos,
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

  const userVideo = userVideos[videoId];
  if (userVideo?.ready) {
    return { status: "ready" };
  }

  return { status: "none" };
}
