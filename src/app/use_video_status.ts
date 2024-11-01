import React from "react";
import {
  RawVideo,
  UserCourses,
  VideoStatus,
  VideoStatusMap,
  VideoTextStatus,
} from "../types";

const VIDEO_HOST = "https://ocw.mit.edu";

type VideoStatusAction =
  | { type: "delete_courses"; courseIds: string[] }
  | { type: "update_course"; courseId: string; updates: Partial<VideoStatus> }
  | { type: "increment_count"; courseId: string };

export type UpdateVideoStatus = React.Dispatch<VideoStatusAction>;

const defaultVideo = (courseId: string): VideoStatus => ({
  courseId,
  status: "unstarted",
  total: 0,
  finished: 0,
  videos: [],
});

function reducer(acc: VideoStatusMap, action: VideoStatusAction) {
  switch (action.type) {
    case "update_course": {
      const course = acc[action.courseId] || defaultVideo(action.courseId);
      return { ...acc, [action.courseId]: { ...course, ...action.updates } };
    }
    case "increment_count": {
      const course = acc[action.courseId];
      if (!course) {
        return acc;
      }
      return {
        ...acc,
        [action.courseId]: { ...course, total: course.total + 1 },
      };
    }
    case "delete_courses": {
      const status = { ...acc };
      action.courseIds.forEach((courseId) => {
        delete status[courseId];
      });
      return status;
    }
  }
}

export default function useVideoStatus(
  userCourses: UserCourses,
): [VideoStatusMap, UpdateVideoStatus] {
  const [status, dispatch] = React.useReducer(reducer, {});

  const buildCourseStatus = React.useCallback(async (courseId: string) => {
    async function getStatus(): Promise<VideoStatus> {
      const cacheKeys = await window.caches.keys();
      const courseCache = await caches.open(`course-${courseId}`);
      const videoFile = await courseCache.match(
        `/courses/${courseId}/_pwa_videos.json`,
      );

      if (!videoFile) {
        return defaultVideo(courseId);
      }

      const rawData: RawVideo[] = await videoFile.json();
      const videos = rawData.map((data) => ({
        courseId,
        url: VIDEO_HOST + data.file,
        youtubeKey: data.youtube_key,
      }));

      if (!cacheKeys.includes(`course-videos-${courseId}`)) {
        return {
          courseId,
          status: "unstarted",
          total: videos.length,
          finished: 0,
          videos: [],
        };
      }

      const cache = await caches.open(`course-videos-${courseId}`);
      const keys = await cache.keys();
      let status: VideoTextStatus = "unstarted";

      if (videos.length === keys.length) {
        status = "complete";
      }
      return {
        courseId,
        status,
        videos,
        total: videos.length,
        finished: keys.length,
      };
    }

    const status = await getStatus();
    dispatch({ type: "update_course", courseId, updates: status });
  }, []);

  React.useEffect(() => {
    const activeCourses = Object.keys(userCourses);
    const processedCourses = Object.keys(status);

    activeCourses.forEach((courseId) => {
      const course = userCourses[courseId]!;
      if (course.ready && !processedCourses.includes(courseId)) {
        buildCourseStatus(courseId);
      }
    });

    const removedCourses = difference(processedCourses, activeCourses);
    if (removedCourses.length > 0) {
      dispatch({ type: "delete_courses", courseIds: removedCourses });
    }
  }, [userCourses]);

  return [status, dispatch];
}

function difference<T>(l1: T[], l2: T[]): T[] {
  return l1.filter((x) => !l2.includes(x));
}
