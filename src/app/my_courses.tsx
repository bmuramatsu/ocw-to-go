import React from "react";
import { MyCourseCard } from "./course_card/course_card";
import { useAppSelector } from "./store/store";
import { selectMyCourses } from "./store/course_selectors";

export default function MyCourses() {
  const myCourses = useAppSelector(selectMyCourses);

  return (
    <>
      <ul className="course-grid has-padding no-inline-padding">
        {myCourses.map((course) => (
          <MyCourseCard key={course.id} courseData={course} />
        ))}
        <li className="course-card--fake"></li>
        <li className="course-card--fake"></li>
      </ul>
    </>
  );
}
