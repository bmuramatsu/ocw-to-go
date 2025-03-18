// Currently all app state is stored in this one slice. It's primarily
// tracking course and video download state. It's populated on page
// load by examining the local file cache.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  newUserCourse,
  UserCourse,
  UserCourses,
  UserVideos,
  UserVideo,
  Queue,
} from "../../types";

interface UserStore {
  userCourses: UserCourses;
  userVideos: UserVideos;
  videoQueue: Queue;
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
      const course = state.userCourses[courseId] || newUserCourse(courseId);
      state.userCourses[courseId] = { ...course, ...updates };
    },
    deleteCourse: (state, action: PayloadAction<{ courseId: string }>) => {
      delete state.userCourses[action.payload.courseId];
      delete state.userVideos[action.payload.courseId];
    },
    updateVideoQueue: (state, action: PayloadAction<Queue>) => {
      state.videoQueue = action.payload;
    },
    updateUserVideo: (state, action: PayloadAction<{ courseId: string; videoId: string; updates: Partial<UserVideo> }>) => {
      const { courseId, videoId, updates } = action.payload;
      if (!state.userVideos[courseId]) {
        state.userVideos[courseId] = {};
      }
      state.userVideos[courseId][videoId] = { ready: false, ...updates };
    }
  },
});

export default userStore.reducer;
export const {
  setInitialCourses,
  setInitialVideos,
  updateCourse,
  deleteCourse,
  updateVideoQueue,
  updateUserVideo,
} = userStore.actions;
