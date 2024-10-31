import React from "react";
import { UserCourse, Video } from "../types";
import { COURSES_BY_ID } from "./initial_course_list";

export default function useVideoDownload(): [
  Video[],
  (userCourse: UserCourse) => void,
] {
  const [queue, setQueue] = React.useState<Video[]>([]);
  const [downloader] = React.useState<VideoDownloader>(
    () => new VideoDownloader(setQueue),
  );
  const downloadCourse = React.useCallback(
    (userCourse: UserCourse) => {
      downloader.addCourseToQueue(userCourse);
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

  async addCourseToQueue(userCourse: UserCourse) {
    await caches.open(`course-videos-${userCourse.id}`);

    for await (const video of userCourse.videos) {
      const exists = await caches.match(
        `/courses/${userCourse.id}/static_resources/${this.videoName(video.url)}`,
      );
      if (!exists) {
        this.queue.push(video);
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
