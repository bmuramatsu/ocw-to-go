import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { newUserCourse } from "../../types";

const selectUserCourses = (state: RootState) => state.user.userCourses;

export const selectUserCourse = createSelector(
  [selectUserCourses, (_: RootState, courseId: string) => courseId],
  (userCourses, courseId) => {
    return userCourses[courseId] || newUserCourse();
  },
);
