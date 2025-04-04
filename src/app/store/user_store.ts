// Currently all app state is stored in this one slice. It's primarily
// tracking course and video download state. It's populated on page
// load by examining the local file cache.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  newUserCourse,
  UserCourse,
  UserCourses,
  UserVideos,
  VideoQueue,
  VideoQueueItem,
} from "../../types";
import { COURSES_BY_ID } from "../initial_course_list";

export interface UserStore {
  userCourses: UserCourses;
  userVideos: UserVideos;
  videoQueue: VideoQueue;
}

const initialState: UserStore = {
  userCourses: {},
  userVideos: {},
  videoQueue: [],
};

const userStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialCourses: (state, action: PayloadAction<UserCourses>) => {
      state.userCourses = action.payload;
    },
    setInitialVideos: (state, action: PayloadAction<UserVideos>) => {
      state.userVideos = action.payload;
    },
    updateCourse: (
      state,
      action: PayloadAction<{ courseId: string; updates: Partial<UserCourse> }>,
    ) => {
      const { courseId, updates } = action.payload;
      const course = state.userCourses[courseId] || newUserCourse();
      state.userCourses[courseId] = { ...course, ...updates };
    },
    deleteCourse: (state, action: PayloadAction<{ courseId: string }>) => {
      delete state.userCourses[action.payload.courseId];
      courseVideoIds(action.payload.courseId).forEach((videoId) => {
        delete state.userVideos[videoId];
      });
    },
    deleteCourseVideos: (
      state,
      action: PayloadAction<{ courseId: string }>,
    ) => {
      courseVideoIds(action.payload.courseId).forEach((videoId) => {
        delete state.userVideos[videoId];
      });
    },
    deleteVideo: (
      state,
      action: PayloadAction<{ courseId: string; videoId: string }>,
    ) => {
      delete state.userVideos[action.payload.videoId];
    },
    addToVideoQueue(state, action: PayloadAction<VideoQueue>) {
      state.videoQueue.push(...action.payload);
    },
    finishVideoDownload: (
      state,
      action: PayloadAction<{ success: boolean; item: VideoQueueItem }>,
    ) => {
      // the item should be the first in the list, but just in case some other
      // modification has happened to the queue, we do it safely
      const { item, success } = action.payload;
      const index = state.videoQueue.findIndex(
        (item) =>
          item.courseId === action.payload.item.courseId &&
          item.videoId === action.payload.item.videoId,
      );

      if (index !== -1) {
        state.videoQueue.splice(index, 1);
      }

      const current = state.userVideos[item.videoId] || { ready: false };
      state.userVideos[item.videoId] = {
        ...current,
        ready: success,
      };
    },
    removeCourseVideosFromQueue: (state, action: PayloadAction<string>) => {
      state.videoQueue = state.videoQueue.filter(
        (item) => item.courseId !== action.payload,
      );
    },
    removeVideoFromQueue: (state, action: PayloadAction<VideoQueueItem>) => {
      state.videoQueue = state.videoQueue.filter(
        (item) =>
          !(
            item.courseId === action.payload.courseId &&
            item.videoId === action.payload.videoId
          ),
      );
    },
  },
});

function courseVideoIds(courseId: string): string[] {
  return COURSES_BY_ID[courseId].videos.map((video) => video.youtubeKey);
}

export default userStore.reducer;

export const userActions = userStore.actions;
