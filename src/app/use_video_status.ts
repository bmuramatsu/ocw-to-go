import React from "react";
import { Video, VideoStatusMap, VideoTextStatus } from "../types";
import { ALL_COURSES } from "./initial_course_list";

export default function useVideoStatus(
  queue: Video[],
): [VideoStatusMap, () => void] {
  const [status, setStatus] = React.useState<VideoStatusMap>({});

  const rebuildStatus = React.useCallback(async () => {
    const statuses: VideoStatusMap = {};
    const cacheKeys = await window.caches.keys();

    for await (const course of ALL_COURSES) {
      if (cacheKeys.includes(`course-videos-${course.id}`)) {
        const total = course.videos.length;
        const cache = await caches.open(`course-videos-${course.id}`);
        const keys = await cache.keys();
        const finished = keys.length;

        let status: VideoTextStatus = "unstarted";
        if (total === finished) {
          status = "complete";
        } else if (queue.find((video) => video.courseId === course.id)) {
          status = "downloading";
        }
        statuses[course.id] = {
          status,
          total,
          finished,
        };
      } else {
        statuses[course.id] = {
          status: "unstarted",
          total: course.videos.length,
          finished: 0,
        };
      }
    }
    setStatus(statuses);
  }, [queue]);

  const prevQueue = React.useRef<Video[]>([]);
  // whenever the queue changes, we should rebuild the status
  React.useEffect(() => {
    if (prevQueue.current !== queue) {
      rebuildStatus();
    } else {
      prevQueue.current = queue;
    }
  }, [queue, rebuildStatus]);

  return [status, rebuildStatus];
}
