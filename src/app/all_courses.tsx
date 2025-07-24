import React from "react";
import { ALL_COURSES } from "./initial_course_list";
import { FeaturedCourseCard } from "./course_card/course_card";

export default function AllCourses() {
  return (
    <>
      <h1>All Courses</h1>
      <ul className="course-grid">
        {ALL_COURSES.map((course) => (
          <FeaturedCourseCard key={course.id} courseData={course} />
        ))}
      </ul>
    </>
  );
}
