import React from "react";
import { Course } from "../types";

export default function useRemoveCourse(setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
  return React.useCallback(async (courseId: string) => {
    await caches.delete("course-" + courseId);

    setCourses(courses => courses.map(course => {
      if (course.id === courseId) {
        return {...course, status: "", ready: false};
      }
      return course;
    }));
    
  }, [setCourses]);
}
