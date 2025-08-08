import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { newUserCourse } from "../../types";
import { ALL_COURSES } from "../initial_course_list";

const selectUserCourses = (state: RootState) => state.user.userCourses;

export const selectUserCourse = createSelector(
  [selectUserCourses, (_: RootState, courseId: string) => courseId],
  (userCourses, courseId) => {
    return userCourses[courseId] || newUserCourse();
  },
);

export const selectMyCourses = createSelector(
  [selectUserCourses],
  (userCourses) => {
    return ALL_COURSES.filter(
      (course) =>
        userCourses[course.id] && userCourses[course.id]!.status !== "none",
    ).sort((a, b) => a.courseNumber.localeCompare(b.courseNumber));
  },
);

export const selectMyCoursesCount = createSelector(
  [selectMyCourses],
  (myCourses) => myCourses.length,
);
