import { CourseData, VideoQueue } from "../../types";
import VideoDownloader from "../video_downloader";
import { cancelCourseDownload, downloadCourseVideos } from "./custom_actions";
import { AppMiddleware } from "./store";
import { userActions, UserStore } from "./user_store";

const videoDownloadMiddleware: AppMiddleware = (store) => {
  const downloader = new VideoDownloader(store);

  return (next) => (action) => {
    console.log(action, store.getState().user);

    if (downloadCourseVideos.match(action)) {
      const newItems = missingCourseVideos(action.payload, store.getState().user);
      store.dispatch(userActions.addToVideoQueue(newItems));
      downloader.bump();
    }

    if (cancelCourseDownload.match(action)) {
      store.dispatch(userActions.removeCourseVideosFromQueue(action.payload))
      downloader.abortCourseDownload(action.payload);
      // bump in case there are other courses queued;
      downloader.bump();
    }

    return next(action);
  };
};

export default videoDownloadMiddleware;

function missingCourseVideos(course: CourseData, userStore: UserStore): VideoQueue {
  const { videoQueue, userVideos }  = userStore;
  const allVideos = course.videos.map((video) => video.youtubeKey);
  const existingVideos: string[] = [];

  for (const [youtubeKey, videoStatus] of Object.entries(userVideos[course.id] || {})) {
    if (videoStatus?.ready) {
      existingVideos.push(youtubeKey);
    }
  }

  videoQueue.forEach(({videoId, courseId}) => {
    if (course.id === courseId) {
      existingVideos.push(videoId);
    }
  });

  const missingVideos = allVideos.filter((youtubeKey) => !existingVideos.includes(youtubeKey));
  return missingVideos.map((videoId) => ({courseId: course.id, videoId}));
}
