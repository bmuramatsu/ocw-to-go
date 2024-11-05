import React from "react";
import CourseListItem from "./course_list_item";
import Footer from "./footer";
import { ALL_COURSES } from "./initial_course_list";

export default function CourseList() {
  return (
    <div className="page-grid">
      <div className="header-container">
        <header>
          <h1>
            <img src="/images/to-go-logo.svg" alt="MIT OpenCourseWare To Go" />
          </h1>
        </header>
      </div>
      <main>
        <h2>Courses</h2>
        <ul className="course-grid">
          {ALL_COURSES.map((course) => (
            <li key={course.id} className="course-card">
              <CourseListItem courseData={course} />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
