import React from "react";
import CourseCard from "./course_card/course_card";
import { useAppSelector } from "./store/store";
import { selectMyCourses } from "./store/course_selectors";

export default function MyCourses() {
  const myCourses = useAppSelector(selectMyCourses);

  if (myCourses.length === 0) {
    return (
      <ul className="course-grid has-padding no-inline-padding">
        <li className="card is-empty">
          <h3 className="h3">Download courses to get started.</h3>
          <p className="text">
            Go to the &quot;All Courses&quot; tab to explore all available
            courses to download to your device.
          </p>
        </li>
      </ul>
    );
  }

  return (
    <ul className="course-grid has-padding no-inline-padding">
      {myCourses.map((course) => (
        <CourseCard key={course.id} courseData={course} />
      ))}
      <li className="course-card--fake"></li>
      <li className="course-card--fake"></li>
    </ul>
  );
}
