import React from "react";
import { vi, expect, test } from "vitest";
import CourseLink from "./course_link";
import { act } from "@testing-library/react";
import { Switch, Route } from "wouter";
import { ALL_COURSES } from "../initial_course_list";
import { appRender } from "../test_helper";
import { CourseData } from "../../types";
import { userActions } from "../store/user_store";

test("CourseLink routes to the course if ready", () => {
  const dom = appRender(
    <Switch>
      <Route path="/">
        <CourseLink courseData={ALL_COURSES[0]}>Go to course</CourseLink>
      </Route>
      <Route path="/courses/:courseId">
        {(params) => <div>Course {params.courseId}</div>}
      </Route>
    </Switch>,
    {
      userStore: {
        userCourses: {
          [ALL_COURSES[0].id]: { status: "ready", downloadProgress: 0 },
        },
      },
    },
  );

  expect(dom.container.innerHTML).toContain("Go to course");
  const a = dom.container.querySelector("a");
  expect(a).toBeTruthy();
  act(() => a!.click());
  expect(dom.container.innerHTML).toContain(`Course ${ALL_COURSES[0].id}`);
});

vi.mock("./store/download_course_action", async () => {
  return {
    default: (courseData: CourseData) =>
      userActions.updateCourse({
        courseId: courseData.id,
        updates: { status: "ready" },
      }),
  };
});

test("CourseLink triggers course download if not ready", () => {
  const dom = appRender(
    <Switch>
      <Route path="/">
        <CourseLink courseData={ALL_COURSES[0]}>Course is not ready</CourseLink>
      </Route>
      <Route path="/courses/:courseId">
        {(params) => <div>Course {params.courseId}</div>}
      </Route>
    </Switch>,
  );
  const a = dom.container.querySelector("a")!;

  act(() => a.click());
  // first click fakes the download progress, but won't redirect yet
  expect(dom.container.innerHTML).toContain("Course is not ready");
  // second click should now redirect to the course
  act(() => a.click());
  expect(dom.container.innerHTML).toContain(`Course ${ALL_COURSES[0].id}`);
});
