import React from 'react';
import { CourseStatus, Video } from '../types';
import { Videos } from './initial_course_list';

export default function useVideoDownload(): [Video[], (course: CourseStatus) => void] {
  const [queue, setQueue] = React.useState<Video[]>([]);
  const [downloader] = React.useState<VideoDownloader>(() => new VideoDownloader(setQueue));
  const downloadCourse = React.useCallback((course: CourseStatus) => {
    downloader.addCourseToQueue(course);
  }, [downloader]);

  return [queue, downloadCourse];
}

class VideoDownloader {
  queue: Video[] = [];
  setQueue: React.Dispatch<React.SetStateAction<Video[]>>;
  running = false;

  constructor(setQueue: React.Dispatch<React.SetStateAction<Video[]>>) {
    this.setQueue = setQueue;
  }

  async addCourseToQueue(course: CourseStatus) {
    await caches.open(`course-videos-${course.id}`);
    const videos = Videos[course.id] || [];
    for await (const video of videos) {
      const exists = await caches.match(`/courses/${course.id}/static_resources/${this.videoName(video)}`);
      if (!exists) {
        this.queue.push({url: video, courseId: course.id});
      }
    }
    if (!this.running) {
      this.startDownload();
    }
    this.setQueue([...this.queue]);
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
        await cache.put(`/courses/${video.courseId}/static_resources/${this.videoName(video.url)}`, new Response(videoBlob, {headers: {'Content-Type': 'video/mp4'}}));

        this.queue.shift();
        this.setQueue([...this.queue]);
      } catch (e) {
        console.error('Failed to download', video, e);
      }
    }
    this.running = false;
  }

  videoName(url: string) {
    return url.split('/').pop();
  }
}
