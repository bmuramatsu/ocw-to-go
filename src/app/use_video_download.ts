import React from 'react';
import { Course, Video, VideoStatusMap } from '../types';
import { ALL_COURSES } from './initial_course_list';

export default function useVideoDownload(courses: Course[]): [VideoStatusMap, (course: Course) => void] {
  const [status, setStatus] = React.useState<VideoStatusMap>({});
  const [downloader] = React.useState<VideoDownloader>(() => new VideoDownloader(courses, setStatus));
  const downloadCourse = React.useCallback((course: Course) => {
    downloader.addCourseToQueue(course);
  }, [downloader]);

  return [status, downloadCourse];
}

class VideoDownloader {
  queue: Video[] = [];
  setStatus: React.Dispatch<React.SetStateAction<VideoStatusMap>>;
  running = false;

  constructor(initialCourses: Course[], setStatus: React.Dispatch<React.SetStateAction<VideoStatusMap>>) {
    this.buildInitialQueue(initialCourses);
    this.setStatus = setStatus;
  }

  async buildInitialQueue(initialCourses: Course[]) {
    const cacheKeys = await caches.keys();

    for await (const course of initialCourses) {
      if (cacheKeys.includes(`course-videos-${course.id}`)) {
        const videoCache = await caches.open(`course-videos-${course.id}`);
        for await (const video of course.videos) {
          const exists = await videoCache.match(`/courses/${course.id}/static_resources/${this.videoName(video)}`);
          if (!exists) {
            this.queue.push({url: video, courseId: course.id});
          }
        }
      }
    }

    this.updateStatus();
    this.startDownload();
  }

  async addCourseToQueue(course: Course) {
    await caches.open(`course-videos-${course.id}`);
    this.updateStatus();

    for await (const video of course.videos) {
      const exists = await caches.match(`/courses/${course.id}/static_resources/${this.videoName(video)}`);
      if (!exists) {
        this.queue.push({url: video, courseId: course.id});
      }
    }
    if (!this.running) {
      this.startDownload();
    }
  }

  async startDownload() {
    this.running = true;
    while (this.queue.length) {
      const video = this.queue.shift()!;
      console.log('Downloading', video);
      try {
        const response = await fetch(video.url);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const cache = await caches.open(`course-videos-${video.courseId}`);
        await cache.put(`/courses/${video.courseId}/static_resources/${this.videoName(video.url)}`, new Response(videoBlob, {headers: {'Content-Type': 'video/mp4'}}));

        await this.updateStatus();
      } catch (e) {
        console.error('Failed to download', video, e);
      }
    }
    this.running = false;
  }

  async updateStatus() {
    const status: VideoStatusMap = {};
    const cacheKeys = await window.caches.keys();

    for await (const course of ALL_COURSES) {
      if (cacheKeys.includes(`course-videos-${course.id}`)) {
        const total = course.videos.length;
        const cache = await caches.open(`course-videos-${course.id}`);
        const keys = await cache.keys();
        const finished = keys.length;

        status[course.id] = {
          status: total === finished ? "complete" : "downloading",
          total,
          finished
        };
      } else {
        status[course.id] = {status: "unstarted", total: course.videos.length, finished: 0};
      }
    }
    this.setStatus(status);
  }

  videoName(url: string) {
    return url.split('/').pop();
  }
}
