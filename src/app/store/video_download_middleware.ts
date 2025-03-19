import { CourseData, VideoQueue } from "../../types";
import VideoDownloader from "../video_downloader";
import * as customActions from "./custom_actions";
import { AppMiddleware } from "./store";
import { userActions, UserStore } from "./user_store";

const videoDownloadMiddleware: AppMiddleware = (store) => {
  const downloader = new VideoDownloader(store);

  return (next) => (action) => {
    console.log(action, store.getState().user);
    function cancelCourseDownload(courseId: string) {
      store.dispatch(userActions.removeCourseVideosFromQueue(courseId))
      downloader.abortCourseDownload(courseId);
      // bump in case there are other courses queued;
      downloader.bump();
      }

    if (customActions.downloadCourseVideos.match(action)) {
      const newItems = missingCourseVideos(action.payload, store.getState().user);
      store.dispatch(userActions.addToVideoQueue(newItems));
      downloader.bump();
    } else if (customActions.cancelCourseDownload.match(action)) {
      cancelCourseDownload(action.payload.courseId);
    } else if (userActions.deleteCourse.match(action)) {
      // cancel just in case downloads are currently running
      cancelCourseDownload(action.payload.courseId);
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
