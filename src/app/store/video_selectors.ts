import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ALL_COURSES, COURSES_BY_ID } from "../initial_course_list";
import { UserVideos, VideoQueue } from "../../types";

type VideoStatus = "none" | "downloading" | "waiting" | "ready" | "error";
// This expands from a simple boolean status to a string
export type FullUserVideo = {
  status: VideoStatus;
  errorMessage?: string;
};
export type CourseVideoStatus = Partial<{
  [videoId: string]: FullUserVideo;
}>;
export type AllVideoStatus = Partial<{
  [courseId: string]: CourseVideoStatus;
}>;

// The purpose of these redux selectors is to make it easier to access video
// state information. Both the UserVideo and VideoQueue store information
// about video status. These selectors combine that information to create a
// simpler and comprehensive view that can easily be viewed at course or individual
// video levels. Performing this combination in a selector also causes the data
// to only be recomputed when the relevant pieces of state change.

const selectQueue = (state: RootState) => state.user.videoQueue;
const selectUserVideos = (state: RootState) => state.user.userVideos;
const selectCourseID = (_: RootState, courseId: string) => courseId;

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
  [selectAllVideoStatus, selectCourseID],
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

type VideoUsage = {
  usedSpace: number;
  totalSpace: number;
  finishedVideos: number;
  totalVideos: number;
  allQueued: boolean;
};
export const selectCourseVideoUsage = createSelector(
  [selectAllVideoStatus, selectCourseID],
  (allVideoStatus, courseId): VideoUsage => {
    const course = COURSES_BY_ID[courseId];
    const videoStatus = allVideoStatus[courseId] || {};

    let usedSpace = 0;
    let totalSpace = 0;
    let finishedVideos = 0;
    // true if all are done or in progress
    let allQueued = true;

    course.videos.forEach((video) => {
      totalSpace += video.contentLength;
      const status = videoStatus[video.youtubeKey]?.status || "none";
      if (status === "ready") {
        usedSpace += video.contentLength;
        finishedVideos++;
      }
      if (status === "none") {
        allQueued = false;
      }
    });

    return {
      usedSpace,
      totalSpace,
      finishedVideos,
      totalVideos: course.videos.length,
      allQueued,
    };
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

  return { status: "none", errorMessage: userVideo?.errorMessage };
}
