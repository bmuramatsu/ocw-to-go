import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  newUserCourse,
  UserCourse,
  UserCourses,
  Video,
  CourseVideos,
  AllCourseVideos,
  defaultVideos,
} from "../../types";

interface UserStore {
  courseVideos: AllCourseVideos;
  userCourses: UserCourses;
  videoQueue: Video[];
}

const initialState: UserStore = {
  courseVideos: {},
  userCourses: {},
  videoQueue: [],
};

const userStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialCourses: (state, action: PayloadAction<UserCourses>) => {
      state.userCourses = action.payload;
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
      delete state.courseVideos[action.payload.courseId];
    },
    updateVideos: (
      state,
      action: PayloadAction<{
        courseId: string;
        updates: Partial<CourseVideos>;
      }>,
    ) => {
      const { courseId, updates } = action.payload;
      const videos = state.courseVideos[courseId] || defaultVideos(courseId);
      state.courseVideos[courseId] = { ...videos, ...updates };
    },
    incrementCount: (state, action: PayloadAction<string>) => {
      const videos = state.courseVideos[action.payload];
      if (videos) {
        videos.finished++;
      }
    },
    updateVideoQueue: (state, action: PayloadAction<Video[]>) => {
      state.videoQueue = action.payload;
    },
  },
});

export default userStore.reducer;
export const {
  setInitialCourses,
  updateCourse,
  deleteCourse,
  updateVideos,
  incrementCount,
  updateVideoQueue,
} = userStore.actions;
