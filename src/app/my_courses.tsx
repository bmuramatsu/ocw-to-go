import React from "react";
import CourseCard from "./course_card/course_card";
import { useAppSelector } from "./store/store";
import { selectMyCourses } from "./store/course_selectors";

export default function MyCourses() {
  const myCourses = useAppSelector(selectMyCourses);

  if (myCourses.length === 0) {
    return (
      <div>
        <p>You haven&apos;t downloaded any courses yet.</p>
        <p>
          Go to the &quot;All Courses&quot; tab to explore all available
          courses.
        </p>
      </div>
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
