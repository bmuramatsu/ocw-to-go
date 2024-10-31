import React from "react";
import { Video } from "../types";
import { COURSES_BY_ID } from "./initial_course_list";

export default function useVideoDownload(): [
  Video[],
  (courseId: string) => void,
] {
  const [queue, setQueue] = React.useState<Video[]>([]);
  const [downloader] = React.useState<VideoDownloader>(
    () => new VideoDownloader(setQueue),
  );
  const downloadCourse = React.useCallback(
    (courseId: string) => {
      downloader.addCourseToQueue(courseId);
    },
    [downloader],
  );

  return [queue, downloadCourse];
}

class VideoDownloader {
  queue: Video[] = [];
  setQueue: React.Dispatch<React.SetStateAction<Video[]>>;
  running = false;

  constructor(setQueue: React.Dispatch<React.SetStateAction<Video[]>>) {
    this.setQueue = setQueue;
  }

  postQueue() {
    this.setQueue([...this.queue]);
  }

  async addCourseToQueue(courseId: string) {
    const course = COURSES_BY_ID[courseId];
    await caches.open(`course-videos-${courseId}`);

    for await (const video of course.videos) {
      const exists = await caches.match(
        `/courses/${courseId}/static_resources/${this.videoName(video)}`,
      );
      if (!exists) {
        this.queue.push({ url: video, courseId: courseId });
      }
    }
    if (!this.running) {
      this.startDownload();
    }
    this.postQueue();
  }

  async startDownload() {
    this.running = true;
    while (this.queue.length) {
      const video = this.queue[0];
      try {
        const response = await fetch(video.url);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const cache = await caches.open(`course-videos-${video.courseId}`);
        await cache.put(
          `/courses/${video.courseId}/static_resources/${this.videoName(video.url)}`,
          new Response(videoBlob, { headers: { "Content-Type": "video/mp4" } }),
        );

        this.queue.shift();
        this.postQueue();
      } catch (e) {
        console.error("Failed to download", video, e);
      }
    }
    this.running = false;
  }

  videoName(url: string) {
    return url.split("/").pop();
  }
}
