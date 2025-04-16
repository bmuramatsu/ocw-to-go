import { describe, expect, test } from "vitest";
import reducer, { userActions as actions } from "./user_store";

function initialState() {
  return {
    userCourses: {},
    userVideos: {},
    videoQueue: [],
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
      actions.setInitialCourses({ course1: { status: "ready" } }),
    );
    expect(result.userCourses["course1"]).toEqual({ status: "ready" });
  });
});
