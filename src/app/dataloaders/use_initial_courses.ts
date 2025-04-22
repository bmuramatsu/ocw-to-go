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
  const courses: UserCourses = {};

  for await (const course of ALL_COURSES) {
    // look for the special file created when course is finished unpacking
    const resp = await caches.match(`/courses/${course.id}/__ready`);

    if (resp) {
      courses[course.id] = newUserCourse({ status: "ready" });
    }
  }

  return courses;
}
