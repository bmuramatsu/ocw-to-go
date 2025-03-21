// Hook to remove a course and cached data
import React from "react";
import { useAppDispatch } from "./store/store";
import { userActions } from "./store/user_store";

export default function useRemoveCourse(courseId: string) {
  const dispatch = useAppDispatch();

  return React.useCallback(async () => {
    await caches.delete("course-" + courseId);
    await caches.delete("course-videos-" + courseId);
    dispatch(userActions.deleteCourse({ courseId }));
  }, [dispatch, courseId]);
}

export function useRemoveCourseVideos(courseId: string) {
  const dispatch = useAppDispatch();

  return React.useCallback(async () => {
    await caches.delete("course-videos-" + courseId);
    dispatch(userActions.deleteCourseVideos({ courseId }));
  }, [dispatch, courseId]);
}

export function useDeleteVideo(courseId: string, videoId: string) {
  const dispatch = useAppDispatch();

  return React.useCallback(async () => {
    const cache = await caches.open(`course-videos-${courseId}`);
    cache.delete(`/course-videos/${courseId}/${videoId}.mp4`);
    dispatch(userActions.deleteVideo({ courseId, videoId }));
  }, [dispatch, courseId, videoId]);
}
