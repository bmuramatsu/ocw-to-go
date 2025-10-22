// In most cases we look courses up by the youtube key, but in some cases we
// only have the path to work with. This extracts the unique part of the path

import { ALL_COURSES } from "../initial_course_list";

export const VIDEOS_BY_PATH: Map<string, string> = new Map();

ALL_COURSES.forEach((course) => {
  course.videos.forEach((video) => {
    VIDEOS_BY_PATH.set(mapKey(course.id, video.htmlFile), video.youtubeKey);
  });
});

function mapKey(courseId: string, path: string) {
  const parts = path.split("/");
  const key = parts[parts.length - 2];
  return `${courseId}__${key}`;
}

export const videoKeyFromPath = (courseId: string, path: string) =>
  VIDEOS_BY_PATH.get(mapKey(courseId, path));
