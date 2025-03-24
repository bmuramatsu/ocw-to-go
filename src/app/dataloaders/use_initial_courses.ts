// hook that builds the list of courses along with their current download
// status. That information is put into redux
import React from "react";
import getInitialUserCourses from "../initial_course_list";
import { setInitialCourses } from "../store/user_store";
import { useAppDispatch } from "../store/store";

// After the app loads, this gets the initial list and puts it in redux
export default function useInitialCourses() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    getInitialUserCourses().then((courses) =>
      dispatch(setInitialCourses(courses)),
    );
  }, [dispatch]);
}
