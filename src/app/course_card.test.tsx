import React from "react";
import { vi, expect, test } from "vitest";
import CourseCard from "./course_card";
import { render } from "./test_helper";
import { act } from "@testing-library/react";
import { ALL_COURSES } from "./initial_course_list";
import { userActions } from "./store/user_store";
import { CourseData } from "../types";

function initialUserStore() {
  return {
    userCourses: {},
    userVideos: {},
    videoQueue: [],
  };
}

// Both of these actions have side-effect we don't want in tests.
// Instead we mock them to immediately update the state as though
// the action was successful.
vi.mock("./store/download_course_action", async () => {
  return {
    default: (courseData: CourseData) =>
      userActions.updateCourse({
        courseId: courseData.id,
        updates: { status: "downloading" },
      }),
  };
});

vi.mock("./store/async_actions", async () => {
  return {
    removeCourse: (courseId: string) =>
      userActions.deleteCourse({ courseId: courseId }),
  };
});


test("CourseCard renders correctly", () => {
  const course = ALL_COURSES[0];
  const dom = render(<CourseCard courseData={course} />);
  expect(dom.getByText(course.name)).toBeTruthy();
});

test("CourseCard dispatches the 'download course' action", () => {
  const course = ALL_COURSES[0];
  const dom = render(<CourseCard courseData={course} />);
  const button = dom.getByText("Download Course");
  act(() => button.click());
  expect(dom.getByText("Downloading Course")).toBeTruthy();
});

test("CourseCard dispatches the 'delete course' action", () => {
  const course = ALL_COURSES[0];
  const dom = render(<CourseCard courseData={course} />, {
    storeData: {
      user: {
        ...initialUserStore(),
        userCourses: { [course.id]: { status: "ready" } },
      },
    },
  });
  const button = dom.getByText("Delete");
  const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
  act(() => button.click());
  expect(confirmSpy).toHaveBeenCalled();

  expect(dom.getByText("Download Course")).toBeTruthy();
});
