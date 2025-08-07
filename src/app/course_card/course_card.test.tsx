import React from "react";
import { vi, expect, test } from "vitest";
// TODO fix
import { FeaturedCourseCard as CourseCard } from "./course_card";
import { appRender } from "../test_helper";
import { act } from "@testing-library/react";
import { ALL_COURSES } from "../initial_course_list";
import { userActions } from "../store/user_store";
import { CourseData } from "../../types";

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
  const dom = appRender(<CourseCard courseData={course} />);
  expect(dom.getByText(course.name)).toBeTruthy();
});

test("CourseCard dispatches the 'download course' action", () => {
  const course = ALL_COURSES[0];
  const dom = appRender(<CourseCard courseData={course} />);
  const button = dom.getByText("Download (", { exact: false });
  act(() => button.click());
  expect(dom.getByText("Downloading (0%)")).toBeTruthy();
});

// This test would have to be moved into the card menu component
// test("CourseCard dispatches the 'delete course' action", () => {
//   const course = ALL_COURSES[0];
//   const dom = appRender(<CourseCard courseData={course} />, {
//     userStore: {
//       userCourses: { [course.id]: { status: "ready", downloadProgress: 0 } },
//     },
//   });
//   const button = dom.getByText("Delete Course and Videos");
//   const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
//   act(() => button.click());
//   expect(confirmSpy).toHaveBeenCalled();

//   expect(dom.getByText("Download Course")).toBeTruthy();
// });
