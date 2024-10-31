import React from "react";
import { UserCourses } from "../types";

export default function useRemoveCourse(
  setCourses: React.Dispatch<React.SetStateAction<UserCourses>>,
  rebuildVideoStatus: () => void,
) {
  return React.useCallback(
    async (courseId: string) => {
      await caches.delete("course-" + courseId);
      await caches.delete("course-videos-" + courseId);

      setCourses((courses) => {
        const withoutCourse = { ...courses };
        delete withoutCourse[courseId];
        return withoutCourse;
      });
      rebuildVideoStatus();
    },
    [setCourses, rebuildVideoStatus],
  );
}
