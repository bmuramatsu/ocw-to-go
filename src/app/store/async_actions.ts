// Hook to remove a course and cached data
import { AppDispatch } from "./store";
import { userActions } from "./user_store";

// These actions use redux 'thunk' functionality to perform asynchronous
// operations, then dispatch actions to update the redux store.

export function removeCourse(courseId: string) {
  return async function removeCourseThunk(dispatch: AppDispatch) {
    await caches.delete("course-" + courseId);
    await caches.delete("course-videos-" + courseId);
    dispatch(userActions.deleteCourse({ courseId }));
  };
}

export function removeCourseVideos(courseId: string) {
  return async function removeCourseVideosThunk(dispatch: AppDispatch) {
    await caches.delete("course-videos-" + courseId);
    dispatch(userActions.deleteCourseVideos({ courseId }));
  };
}

export function deleteVideo(courseId: string, videoId: string) {
  return async function deleteVideoThunk(dispatch: AppDispatch) {
    const cache = await caches.open(`course-videos-${courseId}`);
    cache.delete(`/course-videos/${courseId}/${videoId}.mp4`);
    dispatch(userActions.deleteVideo({ courseId, videoId }));
  };
}
