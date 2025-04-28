import { describe, expect, test } from "vitest";
import reducer, { userActions as actions, UserStore } from "./user_store";
import { ALL_COURSES } from "../initial_course_list";
import { UserCourse } from "../../types";

function initialState(): UserStore {
  return {
    userCourses: {},
    userVideos: {},
    videoQueue: [],
  };
}

function newCourse(params: Partial<UserCourse>): UserCourse {
  return {
    status: "none",
    downloadProgress: 0,
    ...params,
  };
}

describe("setInitialCourses", () => {
  test("sets empty course list", () => {
    const result = reducer(initialState(), actions.setInitialCourses({}));
    expect(result).toEqual(initialState());
  });

  test("sets non-empty course list", () => {
    const result = reducer(
      initialState(),
      actions.setInitialCourses({ course1: newCourse({ status: "ready" }) }),
    );
    expect(result.userCourses["course1"]?.status).toEqual("ready");
  });
});

describe("setInitialVideos", () => {
  test("sets empty video list", () => {
    const result = reducer(initialState(), actions.setInitialVideos({}));
    expect(result).toEqual(initialState());
  });

  test("sets non-empty video list", () => {
    const result = reducer(
      initialState(),
      actions.setInitialVideos({ video1: { ready: true } }),
    );
    expect(result.userVideos["video1"]).toEqual({ ready: true });
  });
});

describe("updateCourse", () => {
  test("updates info about course state", () => {
    const state = initialState();
    state.userCourses["course1"] = newCourse({ status: "none" });
    const result = reducer(
      state,
      actions.updateCourse({
        courseId: "course1",
        updates: { status: "ready" },
      }),
    );
    expect(result.userCourses["course1"]?.status).toEqual("ready");
  });

  test("adds course record if it doesn't exist", () => {
    const result = reducer(
      initialState(),
      actions.updateCourse({
        courseId: "course1",
        updates: { status: "ready" },
      }),
    );
    expect(result.userCourses["course1"]?.status).toEqual("ready");
  });
});

describe("deleteCourse", () => {
  test("deletes the course and related videos", () => {
    const state = initialState();
    const course = ALL_COURSES[0];
    const video = course.videos[0];
    state.userCourses[course.id] = newCourse({ status: "ready" });
    state.userVideos[video.youtubeKey] = { ready: true };
    state.userVideos["other_video"] = { ready: false };

    const result = reducer(
      state,
      actions.deleteCourse({ courseId: course.id }),
    );
    expect(result.userCourses).toEqual({});
    expect(result.userVideos[video.youtubeKey]).toBeUndefined();
    expect(result.userVideos["other_video"]).not.toBeUndefined();
  });
});

describe("deleteCourseVideos", () => {
  test("deletes all videos related to one course", () => {
    const state = initialState();
    const course = ALL_COURSES[0];
    const video = course.videos[0];
    state.userVideos[video.youtubeKey] = { ready: true };
    state.userVideos["other_video"] = { ready: false };

    const result = reducer(
      state,
      actions.deleteCourseVideos({ courseId: course.id }),
    );
    expect(result.userVideos[video.youtubeKey]).toBeUndefined();
    expect(result.userVideos["other_video"]).not.toBeUndefined();
  });
});

describe("deleteVideo", () => {
  test("deletes a single video", () => {
    const state = initialState();
    state.userVideos["video1"] = { ready: true };
    const result = reducer(state, actions.deleteVideo({ videoId: "video1" }));
    expect(result.userVideos["video1"]).toBeUndefined();
  });
});

describe("addToVideoQueue", () => {
  test("adds items to the end of the queue", () => {
    const state = initialState();
    const item0 = { courseId: "course0", videoId: "video0" };
    const item1 = { courseId: "course1", videoId: "video1" };
    const item2 = { courseId: "course2", videoId: "video2" };
    state.videoQueue = [item0];
    const result = reducer(state, actions.addToVideoQueue([item1, item2]));
    expect(result.videoQueue).toEqual([item0, item1, item2]);
  });

  test("does not add duplicates to the queue", () => {
    const state = initialState();
    const item0 = { courseId: "course0", videoId: "video0" };
    const item1 = { courseId: "course1", videoId: "video1" };
    state.videoQueue = [item0];
    const result = reducer(state, actions.addToVideoQueue([item0, item1]));
    expect(result.videoQueue).toEqual([item0, item1]);
  });
});

describe("finishVideoDownload", () => {
  test("removes an item from the queue and updates the video state", () => {
    const state = initialState();
    const item = { courseId: "course0", videoId: "video0" };
    state.videoQueue = [item];
    state.userVideos[item.videoId] = { ready: false };
    const result = reducer(
      state,
      actions.finishVideoDownload({ success: true, item }),
    );
    expect(result.videoQueue).toEqual([]);
    expect(result.userVideos[item.videoId]).toEqual({ ready: true });
  });
});

describe("removeCourseVideosFromQueue", () => {
  test("removes all videos from the queue for a given course", () => {
    const state = initialState();
    const item0 = { courseId: "course0", videoId: "video0" };
    const item1 = { courseId: "course1", videoId: "video1" };
    const item2 = { courseId: "course0", videoId: "video2" };
    state.videoQueue = [item0, item1, item2];
    const result = reducer(
      state,
      actions.removeCourseVideosFromQueue("course0"),
    );
    expect(result.videoQueue).toEqual([item1]);
  });
});

describe("removeVideoFromQueue", () => {
  test("removes a single video from the queue", () => {
    const state = initialState();
    const item0 = { courseId: "course0", videoId: "video0" };
    const item1 = { courseId: "course1", videoId: "video1" };
    state.videoQueue = [item0, item1];
    const result = reducer(state, actions.removeVideoFromQueue(item1));
    expect(result.videoQueue).toEqual([item0]);
  });
});
