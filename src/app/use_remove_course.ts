import React from "react";
import { CourseStatusMap } from "../types";

export default function useRemoveCourse(setCourses: React.Dispatch<React.SetStateAction<CourseStatusMap>>) {
  return React.useCallback(async (courseId: string) => {
    await caches.delete("course-" + courseId);

    setCourses(courses => {
      const course = courses[courseId];
      return {...courses, [course.id]: {...course, status: "", ready: false }}
    });
  }, [setCourses]);
}
