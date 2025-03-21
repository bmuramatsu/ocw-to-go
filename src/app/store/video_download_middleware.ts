import { CourseData, VideoQueue } from "../../types";
import VideoDownloader from "../video_downloader";
import * as customActions from "./custom_actions";
import { AppMiddleware } from "./store";
import { userActions, UserStore } from "./user_store";

const videoDownloadMiddleware: AppMiddleware = (store) => {
  const downloader = new VideoDownloader(store);

  return (next) => (action) => {
    console.log(action, store.getState().user);

    if (customActions.downloadCourseVideos.match(action)) {
      const newItems = missingCourseVideos(
        action.payload,
        store.getState().user,
      );
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

function missingCourseVideos(
  course: CourseData,
  userStore: UserStore,
): VideoQueue {
  const { videoQueue, userVideos } = userStore;
  const allVideos = course.videos.map((video) => video.youtubeKey);
  const existingVideos: string[] = [];

  for (const [youtubeKey, videoStatus] of Object.entries(
    userVideos[course.id] || {},
  )) {
    if (videoStatus?.ready) {
      existingVideos.push(youtubeKey);
    }
  }

  videoQueue.forEach(({ videoId, courseId }) => {
    if (course.id === courseId) {
      existingVideos.push(videoId);
    }
  });

  const missingVideos = allVideos.filter(
    (youtubeKey) => !existingVideos.includes(youtubeKey),
  );
  return missingVideos.map((videoId) => ({ courseId: course.id, videoId }));
}
