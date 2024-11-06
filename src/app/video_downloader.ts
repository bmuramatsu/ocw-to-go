import { Video, CourseVideos } from "../types";
import { VIDEO_HOST } from "./dataloaders/use_video_status";

// Putting this into a class instead of trying to deal with useEffect potentially starting multiple downloads
export default class VideoDownloader {
  #queue: Video[] = [];
  #running = false;
  #setQueue: (queue: Video[]) => void;
  #updateCourseStatus: (courseId: string) => void;

  constructor(
    setQueue: (queue: Video[]) => void,
    updateCourseStatus: (courseId: string) => void,
  ) {
    this.#setQueue = setQueue;
    this.#updateCourseStatus = updateCourseStatus;
  }

  #postQueue() {
    this.#setQueue([...this.#queue]);
  }

  async addCourseToQueue(videoStatus: CourseVideos) {
    await caches.open(`course-videos-${videoStatus.courseId}`);

    for await (const video of videoStatus.videos) {
      const exists = await caches.match(
        `/course-videos/${videoStatus.courseId}/${video.youtubeKey}.mp4`,
      );
      if (!exists) {
        this.#queue.push(video);
      }
    }
    if (!this.#running) {
      this.#startDownload();
    }
    this.#postQueue();
  }

  async cancelDownload(courseId: string) {
    this.#queue = this.#queue.filter((video) => video.courseId !== courseId);
    this.#postQueue();
  }

  async #startDownload() {
    this.#running = true;
    while (this.#queue.length) {
      const video = this.#queue[0];
      try {
        const doOpaqueRequest = !video.url.startsWith(VIDEO_HOST);

        const response = await fetch(video.url, {
          mode: doOpaqueRequest ? "no-cors" : "cors",
        });

        // opaque request is never 'ok', we just accept whatever the response is
        if (!response.ok && !doOpaqueRequest) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        //const videoBlob = await response.blob();
        const cache = await caches.open(`course-videos-${video.courseId}`);
        await cache.put(
          `/course-videos/${video.courseId}/${video.youtubeKey}.mp4`,
          response,
        );

        this.#queue.shift();
        this.#postQueue();
        this.#updateCourseStatus(video.courseId);
      } catch (e) {
        console.error("Failed to download", video, e);
        this.#queue.shift();
        this.#postQueue();
      }
    }
    this.#running = false;
  }
}
