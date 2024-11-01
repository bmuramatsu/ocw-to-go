import React from "react";
import getInitialUserCourses from "../initial_course_list";
import { setInitialCourses } from "../store/user_store";
import { useAppDispatch } from "../store/store";

export default function useInitialCourses() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    getInitialUserCourses().then((courses) =>
      dispatch(setInitialCourses(courses)),
    );
  }, [dispatch]);
}
