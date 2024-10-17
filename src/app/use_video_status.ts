import React from 'react';
import { CourseStatusMap, Video, VideoStatusMap, VideoTextStatus } from '../types';
import { ALL_COURSES, Videos } from './initial_course_list';

export default function useVideoStatus(queue: Video[], courseStatus: CourseStatusMap): VideoStatusMap {
  const [statuses, setStatuses] = React.useState<VideoStatusMap>({});

  React.useEffect(() => {
    async function buildStatus() {
      const statuses: VideoStatusMap = {};
      const cacheKeys = await window.caches.keys();

      for await (const courseData of ALL_COURSES) {
        const course = courseStatus[courseData.id];
        const videos = Videos[course.id] || [];
        if (cacheKeys.includes(`course-videos-${course.id}`)) {
          const total = videos.length;
          const cache = await caches.open(`course-videos-${course.id}`);
          const keys = await cache.keys();
          const finished = keys.length;

          let status: VideoTextStatus = "unstarted";
          if (total === finished) {
            status = "complete";
          } else if (queue.find(video => video.courseId === course.id)) {
            status = "downloading";
          }
          statuses[course.id] = {
            status,
            total,
            finished
          };
        } else {
          statuses[course.id] = {status: "unstarted", total: videos.length, finished: 0};
        }
      }
      setStatuses(statuses);
    }

    buildStatus();
  }, [queue, courseStatus]);

  return statuses;

}
