import React from "react";
import { expect, test } from "vitest";
import CourseLink from "./course_link";
import { render, act } from "@testing-library/react";
import { Router, Switch, Route } from "wouter";
import { memoryLocation } from "wouter/memory-location";

test("CourseLink routes to the course if ready", () => {
  const { hook } = memoryLocation({ path: "/" });

  const dom = render(
    <Router hook={hook}>
      <Switch>
        <Route path="/">
          <CourseLink courseId="123" ready>
            Go to course
          </CourseLink>
        </Route>
        <Route path="/courses/:courseId">
          {(params) => <div>Course {params.courseId}</div>}
        </Route>
      </Switch>
    </Router>,
  );
  expect(dom.container.innerHTML).toContain("Go to course");
  const a = dom.container.querySelector("a");
  expect(a).toBeTruthy();
  act(() => a!.click());
  expect(dom.container.innerHTML).toContain("Course 123");
});

test("CourseLink doesn't route to the course if not ready", () => {
  const { hook } = memoryLocation({ path: "/" });
  const dom = render(
    <Router hook={hook}>
      <Switch>
        <Route path="/">
          <CourseLink courseId="123" ready={false}>
            Course is not ready
          </CourseLink>
        </Route>
        <Route path="/courses/:courseId">
          {(params) => <div>Course {params.courseId}</div>}
        </Route>
      </Switch>
    </Router>,
  );
  const a = dom.container.querySelector("a")!;

  act(() => a.click());
  expect(dom.container.innerHTML).toContain("Course is not ready");
});
