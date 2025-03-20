import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store/store';
import { COURSES_BY_ID } from './initial_course_list';
import { CourseVideos, VideoQueue } from '../types';

type VideoStatus = "none" | "downloading" | "waiting" | "ready" | "error";
type FullUserVideo = {
  status: VideoStatus;
}
type AllVideoStatus = Partial<{
  [courseId: string]: Partial<{
    [videoId: string]: FullUserVideo;
  }>
}>

const selectQueue = (state: RootState) => state.user.videoQueue;
const selectUserVideos = (state: RootState) => state.user.userVideos;

export const selectAllVideoStatus = createSelector([selectQueue, selectUserVideos], (queue, userVideos) => {
  const allVideoStatus: AllVideoStatus = {};

  for (const [courseId, courseVideos] of Object.entries(userVideos)) {
    allVideoStatus[courseId] = {};
    const course = COURSES_BY_ID[courseId];

    course.videos.forEach((video) => {
      allVideoStatus[courseId]![video.youtubeKey] = makeFullVideoStatus(courseVideos!, queue, courseId, video.youtubeKey);
    });
  }

  return allVideoStatus;
});

function makeFullVideoStatus(courseVideos: CourseVideos, queue: VideoQueue, courseId: string, videoId: string): FullUserVideo {
  const queueIndex = queue.findIndex((item) => item.courseId === courseId && item.videoId === videoId);

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
