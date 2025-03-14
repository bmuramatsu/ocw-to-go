// Hook that tracks the status of videos within a course.
import React from "react";
import { RawVideo, CourseVideos, defaultVideos } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { updateVideos } from "../store/user_store";

export const VIDEO_HOST = "https://ocw.mit.edu";

// When a new course is 'ready', this will build the video status
export default function useVideoStatus() {
  const userCourses = useAppSelector(({ user }) => user.userCourses);
  const courseVideos = useAppSelector(({ user }) => user.courseVideos);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const activeCourses = Object.keys(userCourses);
    const processedCourses = Object.keys(courseVideos);

    activeCourses.forEach((courseId) => {
      const course = userCourses[courseId]!;
      if (course.ready && !processedCourses.includes(courseId)) {
        buildCourseStatus(courseId).then((videoStatus) => {
          dispatch(updateVideos({ courseId, updates: videoStatus }));
        });
      }
    });
  }, [dispatch, userCourses, courseVideos]);

  return [courseVideos, dispatch];
}

async function buildCourseStatus(courseId: string): Promise<CourseVideos> {
  const cacheKeys = await window.caches.keys();
  const courseCache = await caches.open(`course-${courseId}`);
  const videoFile = await courseCache.match(
    `/courses/${courseId}/_pwa_videos.json`,
  );

  if (!videoFile) {
    return defaultVideos(courseId);
  }

  const rawData: RawVideo[] = await videoFile.json();
  const videos = rawData.map((data) => ({
    courseId,
    url: data.file ? VIDEO_HOST + data.file : data.archive_url!,
    youtubeKey: data.youtube_key,
  }));

  if (!cacheKeys.includes(`course-videos-${courseId}`)) {
    return {
      courseId,
      videos,
      total: videos.length,
      finished: 0,
    };
  }

  const cache = await caches.open(`course-videos-${courseId}`);
  const keys = await cache.keys();

  return {
    courseId,
    videos,
    total: videos.length,
    finished: keys.length,
  };
}
