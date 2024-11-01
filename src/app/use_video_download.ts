import React from "react";
import { Video, VideoStatus } from "../types";
import { UpdateVideoStatus } from "./use_video_status";

export default function useVideoDownload(
  updateCourseStatus: UpdateVideoStatus,
): [Video[], (videoStatus: VideoStatus) => void] {
  const [queue, setQueue] = React.useState<Video[]>([]);
  const [downloader] = React.useState<VideoDownloader>(
    () => new VideoDownloader(setQueue, updateCourseStatus),
  );
  const downloadCourse = React.useCallback(
    (videoStatus: VideoStatus) => {
      downloader.addCourseToQueue(videoStatus);
    },
    [downloader],
  );

  return [queue, downloadCourse];
}

class VideoDownloader {
  queue: Video[] = [];
  setQueue: React.Dispatch<React.SetStateAction<Video[]>>;
  running = false;
  updateCourseStatus: UpdateVideoStatus;

  constructor(
    setQueue: React.Dispatch<React.SetStateAction<Video[]>>,
    updateCourseStatus: UpdateVideoStatus,
  ) {
    this.setQueue = setQueue;
    this.updateCourseStatus = updateCourseStatus;
  }

  postQueue() {
    this.setQueue([...this.queue]);
  }

  async addCourseToQueue(videoStatus: VideoStatus) {
    await caches.open(`course-videos-${videoStatus.courseId}`);

    for await (const video of videoStatus.videos) {
      const exists = await caches.match(
        `/course-videos/${videoStatus.courseId}/${video.youtubeKey}.mp4`,
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
          `/course-videos/${video.courseId}/${video.youtubeKey}.mp4`,
          new Response(videoBlob, { headers: { "Content-Type": "video/mp4" } }),
        );

        this.queue.shift();
        this.postQueue();
        this.updateCourseStatus({
          type: "increment_count",
          courseId: video.courseId,
        });
      } catch (e) {
        console.error("Failed to download", video, e);
      }
    }
    this.running = false;
  }
}
