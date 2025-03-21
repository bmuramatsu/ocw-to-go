// hook that builds the list of courses along with their current download
// status. That information is put into redux
import React from "react";
import { userActions } from "../store/user_store";
import { useAppDispatch } from "../store/store";
import { newUserCourse, UserCourses } from "../../types";
import { ALL_COURSES } from "../initial_course_list";

// After the app loads, this gets the initial list and puts it in redux
export default function useInitialCourses() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    getInitialUserCourses().then((courses) =>
      dispatch(userActions.setInitialCourses(courses)),
    );
  }, [dispatch]);
}

async function getInitialUserCourses(): Promise<UserCourses> {
  const cacheKeys = await window.caches.keys();

  const courses: UserCourses = {};

  for await (const course of ALL_COURSES) {
    const ready = cacheKeys.includes(`course-${course.id}`);
    if (ready) {
      courses[course.id] = newUserCourse({ status: "ready" });
    }
  }

  return courses;
}
