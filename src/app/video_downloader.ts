import { CourseData, Queue, QueueItem, UserVideo } from "../types";

const VIDEO_HOST = "https://ocw.mit.edu";

// This maintains a queue of videos to download and downloads them one at a time.
// It is initialized from the react app, and public functions may be called from the app.
// In order to inform the app of changes to the queue, it accepts callback functions.
// This way it doesn't have to be aware of react/redux.

// It was put into a class instead of done in react directly because of the complexity of
// managing the queue. React hooks are not well suited to this kind of state management.
export default class VideoDownloader {
  #queue: Queue = [];
  #currentVideo: QueueItem | undefined = undefined;
  #setQueue: (queue: Queue) => void;
  #updateVideo: (courseId: string, videoId: string, updates: Partial<UserVideo>) => void;
  #canceller: AbortController;

  constructor(
    setQueue: (queue: Queue) => void,
    updateVideo: (courseId: string, videoId: string, updates: Partial<UserVideo>) => void,
  ) {
    this.#setQueue = setQueue;
    this.#updateVideo = updateVideo;
    this.#canceller = new AbortController();
  }

  #postQueue() {
    const copy = [...this.#queue];
    if (this.#currentVideo) {
      copy.unshift(this.#currentVideo);
    }
    this.#setQueue(copy);
  }

  async addCourseToQueue(course: CourseData) {
    await caches.open(`course-videos-${course.id}`);

    for await (const video of course.videos) {
      const exists = await caches.match(
        `/course-videos/${course.id}/${video.youtubeKey}.mp4`,
      );
      if (!exists) {
        this.#queue.push({course, video});
      }
    }
    if (!this.#currentVideo) {
      this.#startDownload();
    } else {
      this.#postQueue();
    }
  }

  async cancelDownload(courseId: string) {
    this.#queue = this.#queue.filter((item) => item.course.id !== courseId);
    const oldCanceller = this.#canceller;
    // once it has been aborted, all future requests will be aborted, so we need to create a new one.
    // I assign it before creating so that future iterations of the loop will use the new one
    this.#canceller = new AbortController();
    oldCanceller.abort();
    this.#postQueue();
  }

  async #startDownload() {
    while ((this.#currentVideo = this.#queue.shift())) {
      this.#postQueue();

      try {
        let url = this.#currentVideo.video.videoUrl;
        const doOpaqueRequest = !url.startsWith(VIDEO_HOST);
        // some of the archive.org links are http, but seem to work fine over https
        url = url.replace(/^http:/, "https:");

        const response = await fetch(url, {
          mode: doOpaqueRequest ? "no-cors" : "cors",
          signal: this.#canceller.signal,
        });

        // opaque request is never 'ok', we just accept whatever the response is
        if (!response.ok && !doOpaqueRequest) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }

        const cache = await caches.open(
          `course-videos-${this.#currentVideo.course.id}`,
        );
        await cache.put(
          `/course-videos/${this.#currentVideo.course.id}/${this.#currentVideo.video.youtubeKey}.mp4`,
          response,
        );

        this.#updateVideo(this.#currentVideo.course.id, this.#currentVideo.video.youtubeKey, {ready: true});
      } catch (e: unknown) {
        console.error("Failed to download", this.#currentVideo, e);
      }
    }

    this.#postQueue();
  }
}
