// This is the landing page
import React from "react";
import { Link } from "wouter";
import ScrollTo from "./scroll_to";
import { ALL_COURSES } from "./initial_course_list";
import { FeaturedCourseCard } from "./course_card/course_card";

export default function Homepage() {
  const courseCount = React.useMemo(() => {
    return ALL_COURSES.length;
  }, []);

  const featuredCourses = React.useMemo(() => {
    return ALL_COURSES.filter((course) => course.featured).sort((a, b) =>
      a.courseNumber.localeCompare(b.courseNumber),
    );
  }, []);

  return (
    <main>
      <div>
        <h1>
          MIT courses for <span>offline</span> learning
        </h1>
        <p>
          Download MIT OpenCourseWare courses and materials. Perfect for limited
          internet access or data caps.
        </p>
        <Link href="/all-courses">Explore courses</Link>
        <Link href="/my-courses">My courses</Link>
      </div>
      <div>
        Browse.
        <br />
        Download.
        <br />
        Learn.
        <br />
        <ScrollTo href="#how-to-use">Learn More</ScrollTo>
      </div>
      <div>
        <h2>Featured courses</h2>
        <h2>Cards go here</h2>
        <ul className="course-grid">
          {featuredCourses.map((course) => (
            <FeaturedCourseCard key={course.id} courseData={course} />
          ))}
        </ul>
        <Link href="/all-courses">Explore all {courseCount} courses</Link>
      </div>
      <div id="how-to-use">
        <h2>How to use</h2>
        <h3>Browse Courses</h3>
        <p>
          Look through our catalog and choose a course you would like to start
          using.
        </p>
        <Link href="/all-courses">Browse courses</Link>
      </div>
    </main>
  );
}
