import { VideoData, VideoQueue, VideoQueueItem } from "../types";
import { COURSES_BY_ID } from "./initial_course_list";
import { AppMiddlewareAPI } from "./store/store";
import { userActions } from "./store/user_store";

const VIDEO_HOST = "https://ocw.mit.edu";

// This maintains a queue of videos to download and downloads them one at a
// time. It is initialized from a redux middleware, and all interactions from
// the app must be done through dispatching actions. The list of videos that
// acts as a queue is stored in redux, so that the UI can access it. This class
// has access to the store so it can access that queue, and dispatch actions
// as it progresses through the queue.

// It was put into a class instead of done in react directly because the
// complexity of managing the queue in a long-running process isn't well-suited
// to react or react hooks.
export default class VideoDownloader {
  store: AppMiddlewareAPI;
  // this is used to cancel the current download
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

  // This starts the download process if it isn't already running. Usually
  // called from middleware after the queue has been modified.
  bump() {
    const next = this.queue[0];
    if (!this.running && next) {
      this.downloadItem(next);
    }
  }

  // when we abort all downloads for a course, stop the current download if
  // it's in that course
  abortCourseDownload(courseId: string) {
    if (this.running?.courseId == courseId) {
      this.abortCurrentDownload();
    }
  }

  // abort the current download if it matches the given ids
  abortVideoDownload(courseId: string, videoId: string) {
    if (
      this.running?.courseId == courseId &&
      this.running?.videoId == videoId
    ) {
      this.abortCurrentDownload();
    }
  }

  abortCurrentDownload() {
    this.canceller.abort();
    // once the controller is aborted, all future downloads are immediately
    // aborted. So we create a fresh instance.
    this.canceller = new AbortController();
    this.running = null;
    // bump in case there are other courses/videos queued;
    this.bump();
  }

  // Downloads a single video. When it's done, it will call finishDownload
  // which will continue the processing.
  async downloadItem(item: VideoQueueItem) {
    this.running = item;

    let url = this.video(item.courseId, item.videoId).videoUrl;
    // some videos are hosted on archive.org, which doesn't support CORS properly,
    // but you can do an 'opaque' request to get the video. This means the user
    // can see the video, but we can't access any information about it, including
    // whether it was successful or not. This is not ideal, but it works
    const doOpaqueRequest = !url.startsWith(VIDEO_HOST);
    // some of the archive.org links are http, but seem to work fine over https
    url = url.replace(/^http:/, "https:");

    try {
      const response = await fetch(url, {
        mode: doOpaqueRequest ? "no-cors" : "cors",
        signal: this.canceller.signal,
      });

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
      // and bump the downloader.
      const wasAborted = e instanceof DOMException && e.name === "AbortError";
      if (!wasAborted) {
        console.error("download was aborted");
        this.finishDownload(false, item);
      }
    }
  }

  video(courseId: string, videoId: string): VideoData {
    return COURSES_BY_ID[courseId].videos.find(
      (video) => video.youtubeKey === videoId,
    )!;
  }

  // update the queue and start the next download
  finishDownload(success: boolean, item: VideoQueueItem) {
    this.running = null;
    this.store.dispatch(userActions.finishVideoDownload({ success, item }));
    this.bump();
  }
}
