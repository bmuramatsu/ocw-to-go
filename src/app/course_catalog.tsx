import React from "react";
import { Link } from "wouter";
import { useAppSelector } from "./store/store";
import { ALL_COURSES } from "./initial_course_list";
import { selectMyCoursesCount } from "./store/course_selectors";

interface Props {
  children: React.ReactNode;
}

export default function CourseCatalog({ children }: Props) {
  const allCoursesCount = ALL_COURSES.length;
  const myCoursesCount = useAppSelector(selectMyCoursesCount);

  return (
    <main>
      <h2>Course Catalog</h2>
      <p>
        Explore {allCoursesCount} MIT OpenCourseWare courses curated for offline
        learning from your mobile device.
      </p>
      <Link href="/my-courses" className={(active) => (active ? "active" : "")}>
        My courses ({myCoursesCount})
      </Link>
      <Link
        href="/all-courses"
        className={(active) => (active ? "active" : "")}
      >
        All courses ({allCoursesCount})
      </Link>
      {children}
    </main>
  );
}
