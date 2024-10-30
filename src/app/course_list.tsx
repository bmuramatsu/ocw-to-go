import React from "react";
import CourseListItem from "./course_list_item";
import { Course, VideoStatusMap } from "../types";
import { Logo } from "./svgs";
import Footer from "./footer";

interface Props {
  courses: Course[];
  videoStatus: VideoStatusMap;
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
  downloadCourseVideos: (course: Course) => void;
}

export default function CourseList({
  courses,
  videoStatus,
  downloadCourse,
  removeCourse,
  downloadCourseVideos,
}: Props) {
  return (
    <div className="page-grid">
      <div className="header-container">
        <header>
          <h1>
            <img src="/images/to-go-logo.svg" alt="MIT Logo" />
          </h1>
        </header>
      </div>
      <main>
        <h2>Courses</h2>
        <ul className="course-grid">
          {courses.map((course) => (
            <li key={course.id} className="course-card">
              <CourseListItem
                course={course}
                videoStatus={videoStatus[course.id]}
                removeCourse={() => removeCourse(course.id)}
                downloadCourse={() => downloadCourse(course.id, course.file)}
                downloadCourseVideos={() => downloadCourseVideos(course)}
              />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
