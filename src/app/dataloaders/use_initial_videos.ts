// This hook determines the current state of video downloads by checking the
// cache against the videos listed in each course
import React from "react";
import { userActions } from "../store/user_store";
import { useAppDispatch } from "../store/store";
import { UserVideos } from "../../types";
import { ALL_COURSES } from "../initial_course_list";

export default function useInitialCourses() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    getInitialVideos().then((videos) =>
      dispatch(userActions.setInitialVideos(videos)),
    );
  }, [dispatch]);
}

async function getInitialVideos(): Promise<UserVideos> {
  const cacheKeys = await window.caches.keys();

  const userVideos: UserVideos = {};

  for await (const course of ALL_COURSES) {
    const ready = cacheKeys.includes(`course-videos-${course.id}`);
    if (ready) {
      const cache = await caches.open(`course-videos-${course.id}`);

      for (const video of course.videos) {
        const videoPath = `/course-videos/${course.id}/${video.youtubeKey}.mp4`;
        const exists = await cache.match(videoPath);

        if (exists) {
          userVideos[video.youtubeKey] = { ready: true };
        }
      }
    }
  }
  return userVideos;
}
