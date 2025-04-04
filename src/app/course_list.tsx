// This is the home page
import React from "react";
import CourseCard from "./course_card";
import { ALL_COURSES } from "./initial_course_list";

export default function CourseList() {
  return (
    <main>
      <h2>Courses</h2>
      <ul className="course-grid">
        {ALL_COURSES.map((course) => (
          <li key={course.id} className="course-card">
            <CourseCard courseData={course} />
          </li>
        ))}
      </ul>
    </main>
  );
}
