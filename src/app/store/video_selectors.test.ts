import { describe, expect, test } from "vitest";
import {
  selectAllVideoStatus,
  selectCourseVideoStatus,
  selectVideoStatus,
} from "./video_selectors";
import { RootState } from "./store";
import { ALL_COURSES } from "../initial_course_list";

function initialState(): RootState {
  return {
    user: {
      userCourses: {},
      userVideos: {},
      videoQueue: [],
    },
  };
}

describe("selectAllVideoStatus", () => {
  test("returns object with known courses and videos populated with 'none'", () => {
    const result = selectAllVideoStatus(initialState());
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    expect(result[course.id]![video.youtubeKey]).toEqual({ status: "none" });
  });

  test("identifies 'ready' courses from the store", () => {
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    const state = initialState();
    state.user.userVideos[video.youtubeKey] = { ready: true };
    const result = selectAllVideoStatus(state);

    expect(result[course.id]![video.youtubeKey]).toEqual({ status: "ready" });
  });

  test("marks as 'downloading' if at the top of the queue", () => {
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    const state = initialState();
    state.user.videoQueue.push({
      courseId: course.id,
      videoId: video.youtubeKey,
    });
    const result = selectAllVideoStatus(state);

    expect(result[course.id]![video.youtubeKey]).toEqual({
      status: "downloading",
    });
  });

  test("marks as 'waiting' if later in the queue", () => {
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    const state = initialState();
    state.user.videoQueue.push({ courseId: "other", videoId: "other" });
    state.user.videoQueue.push({
      courseId: course.id,
      videoId: video.youtubeKey,
    });
    const result = selectAllVideoStatus(state);

    expect(result[course.id]![video.youtubeKey]).toEqual({
      status: "waiting",
    });
  });
});

describe("selectCourseVideoStatus", () => {
  test("returns empty object for unknown course", () => {
    const result = selectCourseVideoStatus(initialState(), "course-x");
    expect(result).toEqual({});
  });

  test("returns course video status for known course", () => {
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    const state = initialState();
    state.user.userVideos[video.youtubeKey] = { ready: true };
    const result = selectCourseVideoStatus(state, course.id);

    expect(result[video.youtubeKey]).toEqual({ status: "ready" });
  });
});

describe("selectVideoStatus", () => {
  test("returns default status for unknown course and video", () => {
    const result = selectVideoStatus(initialState(), "course-x", "video-y");
    expect(result).toEqual({ status: "none" });
  });

  test("drills down to specific video status", () => {
    const course = ALL_COURSES[1];
    const video = course.videos[1];

    const state = initialState();
    state.user.userVideos[video.youtubeKey] = { ready: true };
    const result = selectVideoStatus(state, course.id, video.youtubeKey);

    expect(result).toEqual({ status: "ready" });
  });
});
