// This is the landing page
import React from "react";
import { Link } from "wouter";
import ScrollTo from "./scroll_to";
import { ALL_COURSES } from "./initial_course_list";
import { FeaturedCourseCard } from "./course_card/course_card";
import {
  ChevronRight,
  HeroImg,
  PhoneImg,
  DownloadImg,
  ChalkboardImg,
} from "./svgs";
import { featuredCourseNumbers } from "../courses/featured";
import { CourseData } from "../types";

export default function Homepage() {
  const courseCount = ALL_COURSES.length;

  const featuredCourses = React.useMemo(() => {
    const featuredCourses: CourseData[] = [];

    featuredCourseNumbers.forEach((courseNumber) => {
      const course = ALL_COURSES.find((c) => c.courseNumber === courseNumber);
      if (course) {
        featuredCourses.push(course);
      } else {
        console.warn(`Featured course ${courseNumber} not found`);
      }
    });

    return featuredCourses;
  }, []);

  return (
    <main>
      <section>
        <div className="main__contain">
          <div className="hero">
            <div className="hero__col">
              <h1 className="h1">
                MIT OpenCourseWare course materials for <span>offline, mobile learning</span>
              </h1>
              <p className="text">
                Download a curated list of MIT OpenCourseWare course materials. Perfect
                for limited internet access or data caps on mobile devices.
              </p>
              <div className="flex align-center wrap gap-16">
                <Link className="btn btn--primary" href="/all-courses">
                  Explore all {courseCount} courses
                </Link>
                <Link href="/my-courses" className="btn btn--primary-outlined">
                  My courses
                </Link>
              </div>
            </div>
            <div className="hero__col">
              <div className="steps-feature">
                <div className="steps-hero">
                  <HeroImg />
                </div>
                <div>
                  <p>Explore.</p>
                  <p>Download.</p>
                  <p>Learn.</p>
                  <ScrollTo
                    href="#how-to-use"
                    className="btn btn--tertiary u-mt-12"
                  >
                    Learn More
                    <ChevronRight />
                  </ScrollTo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="main__contain">
          <h2 className="h2 u-text-center">Featured courses</h2>
          <ul className="course-grid">
            {featuredCourses.map((course) => (
              <FeaturedCourseCard key={course.id} courseData={course} />
            ))}
          </ul>
          <div className="flex justify-center u-mt-24">
            <Link className="btn btn--primary" href="/all-courses">
              Explore all {courseCount} courses
            </Link>
          </div>
        </div>
      </section>
      <section className="section-padding bg--red" id="how-to-use">
        <div className="main__contain blog-width">
          <h2 className="h2 u-text-center is-red">How to use</h2>
          <ul className="how-to-use-list">
            <li>
              <PhoneImg />
              <h3 className="h3">
                <span>Step 1</span>Explore Courses
              </h3>
              <p className="text">
                Look through our catalog and choose a course you would like to
                start using.
              </p>
            </li>
            <li>
              <DownloadImg />
              <h3 className="h3">
                <span>Step 2</span>Download a course
              </h3>
              <p className="text">
                Click the “Download” button on your chosen course&apos;s card.
                This will download all course content <b>except for videos</b>.
                To download the videos for a course, continue to step 3.
              </p>
            </li>
            <li>
              <DownloadImg />
              <h3 className="h3">
                <span>Step 3</span>Download videos
              </h3>
              <p className="text">
                Once your course has finished downloading, a new “Download
                videos” button will appear. Clicking on this will display all
                available videos for your chosen course. You may download videos
                individually or all at once on this screen.
              </p>
            </li>
            <li>
              <ChalkboardImg />
              <h3 className="h3">
                <span>Step 4</span>Start learning
              </h3>
              <p className="text">
                Your course is download, your videos are on your device,
                it&apos;s time to start learning!
              </p>
            </li>
          </ul>
          <div className="flex justify-center u-mt-24">
            <Link className="btn btn--primary" href="/all-courses">
              Explore all {courseCount} courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
