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
      <section className="section-padding">
        <div className="main__contain">
          <h1 className="h1 u-mb-8">Course Catalog</h1>
          <p className="text u-mt-8 u-mb-0">
            Explore {allCoursesCount} MIT courses optimized for offline learning.
          </p>
        </div>
      </section>
      <nav className="tabs">
        <Link href="/my-courses" className={(active) => (active ? "active" : "")}>
          My courses ({myCoursesCount})
        </Link>
        <Link
          href="/all-courses"
          className={(active) => (active ? "active" : "")}
        >
          All courses ({allCoursesCount})
        </Link>
      </nav>
      <section className="bg--gray u-pb-72">
        <div className="main__contain no-padding">
          {children}
        </div>
      </section>
    </main>
  );
}
