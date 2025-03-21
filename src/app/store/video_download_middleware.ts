import { CourseData, VideoQueue } from "../../types";
import { selectCourseVideoStatus } from "../video_selectors";
import VideoDownloader from "../video_downloader";
import * as customActions from "./custom_actions";
import { AppMiddleware, RootState } from "./store";
import { userActions } from "./user_store";

const videoDownloadMiddleware: AppMiddleware = (store) => {
  const downloader = new VideoDownloader(store);

  return (next) => (action) => {
    console.log(action, store.getState().user);

    if (customActions.downloadCourseVideos.match(action)) {
      const newItems = missingCourseVideos(action.payload, store.getState());
      store.dispatch(userActions.addToVideoQueue(newItems));
      downloader.bump();
    } else if (customActions.downloadVideo.match(action)) {
      store.dispatch(userActions.addToVideoQueue([action.payload]));
      downloader.bump();
    } else if (customActions.cancelCourseDownload.match(action)) {
      store.dispatch(
        userActions.removeCourseVideosFromQueue(action.payload.courseId),
      );
      downloader.abortCourseDownload(action.payload.courseId);
    } else if (customActions.cancelVideoDownload.match(action)) {
      store.dispatch(userActions.removeVideoFromQueue(action.payload));
      downloader.abortVideoDownload(
        action.payload.courseId,
        action.payload.videoId,
      );
    } else if (userActions.deleteCourse.match(action)) {
      store.dispatch(
        userActions.removeCourseVideosFromQueue(action.payload.courseId),
      );
      downloader.abortCourseDownload(action.payload.courseId);
    }

    return next(action);
  };
};

export default videoDownloadMiddleware;

function missingCourseVideos(course: CourseData, store: RootState): VideoQueue {
  const courseVideos = selectCourseVideoStatus(store, course.id);
  const newQueueItems: VideoQueue = [];

  for (const video of course.videos) {
    if (courseVideos[video.youtubeKey]?.status === "none") {
      newQueueItems.push({ courseId: course.id, videoId: video.youtubeKey });
    }
  }

  return newQueueItems;
}
