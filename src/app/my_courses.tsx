import React from "react";
import { MyCourseCard } from "./course_card/course_card";
import { useAppSelector } from "./store/store";
import { selectMyCourses } from "./store/course_selectors";

export default function MyCourses() {
  const myCourses = useAppSelector(selectMyCourses);

  return (
    <>
      <h1>My Courses</h1>
      <ul className="course-grid">
        {myCourses.map((course) => (
          <MyCourseCard key={course.id} courseData={course} />
        ))}
      </ul>
    </>
  );
}
