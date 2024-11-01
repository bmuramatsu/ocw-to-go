import React from "react";
import { useAppDispatch } from "./store/store";
import { deleteCourse } from "./store/user_store";

export default function useRemoveCourse(courseId: string) {
  const dispatch = useAppDispatch();

  return React.useCallback(async () => {
    await caches.delete("course-" + courseId);
    await caches.delete("course-videos-" + courseId);
    dispatch(deleteCourse({ courseId }));
  }, [dispatch, courseId]);
}
