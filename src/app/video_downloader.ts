import { VideoData, VideoQueue, VideoQueueItem } from "../types";
import { COURSES_BY_ID } from "./initial_course_list";
import { AppMiddlewareAPI } from "./store/store";
import { userActions } from "./store/user_store";

const VIDEO_HOST = "https://ocw.mit.edu";

export default class VideoDownloader {
  store: AppMiddlewareAPI;
  canceller: AbortController;
  running: VideoQueueItem | null;

  constructor(store: AppMiddlewareAPI) {
    this.store = store;
    this.canceller = new AbortController();
    this.running = null;
  }

  get queue(): VideoQueue {
    return this.store.getState().user.videoQueue;
  }

  bump() {
    const next = this.queue[0];
    if (!this.running && next) {
      this.downloadItem(next);
    }
  }

  abortCourseDownload(courseId: string) {
    if (this.running?.courseId == courseId) {
      this.canceller.abort();
      this.canceller = new AbortController();
      this.running = null;
    }
  }

  async downloadItem(item: VideoQueueItem) {
    this.running = item;

    let url = this.video(item.courseId, item.videoId).videoUrl;
    const doOpaqueRequest = !url.startsWith(VIDEO_HOST);
    // some of the archive.org links are http, but seem to work fine over https
    url = url.replace(/^http:/, "https:");

    try {
      const response = await fetch(url, {
        mode: doOpaqueRequest ? "no-cors" : "cors",
        signal: this.canceller.signal,
      });

      console.log("response", response);
      // opaque request is never 'ok', we just accept whatever the response is
      if (!response.ok && !doOpaqueRequest) {
        throw new Error(`Failed to download video: ${response.statusText}`);
      }

      const cache = await caches.open(`course-videos-${item.courseId}`);
      await cache.put(
        `/course-videos/${item.courseId}/${item.videoId}.mp4`,
        response,
      );
      this.finishDownload(true, item);
    } catch (e) {
      console.error("Failed to download", item, e);

      // If the download was aborted, allow the middleware to clean up the queue
      // and bump the downloader
      const wasAborted = e instanceof DOMException && e.name === "AbortError";
      console.error("was aborted", wasAborted);
      if (!wasAborted) {
        this.finishDownload(false, item);
      }
    }

  }

  video(courseId: string, videoId: string): VideoData {
    return COURSES_BY_ID[courseId].videos.find(
      (video) => video.youtubeKey === videoId,
    )!;
  }

  finishDownload(success: boolean, item: VideoQueueItem) {
    this.running = null;
    this.store.dispatch(userActions.finishVideoDownload({ success, item }));
    this.bump();
  }
}
