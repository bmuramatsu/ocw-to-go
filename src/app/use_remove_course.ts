import React from "react";
import { Course } from "../types";

export default function useRemoveCourse(setCourses: React.Dispatch<React.SetStateAction<Course[]>>, rebuildVideoStatus: () => void) {
  return React.useCallback(async (courseId: string) => {
    await caches.delete("course-" + courseId);
    await caches.delete("course-videos-" + courseId);

    setCourses(courses => courses.map(course => {
      if (course.id === courseId) {
        return {...course, status: "", ready: false};
      }
      return course;
    }));
    rebuildVideoStatus();
    
  }, [setCourses, rebuildVideoStatus]);
}
