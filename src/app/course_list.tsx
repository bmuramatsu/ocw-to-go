import React from "react";
import CourseListItem from "./course_list_item";
import { UserCourses, VideoStatus, VideoStatusMap } from "../types";
import Footer from "./footer";
import { ALL_COURSES } from "./initial_course_list";

interface Props {
  userCourses: UserCourses;
  videoStatus: VideoStatusMap;
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
  downloadCourseVideos: (videoStatus: VideoStatus) => void;
  coursesInQueue: Set<string>;
}

export default function CourseList({
  userCourses,
  videoStatus,
  downloadCourse,
  removeCourse,
  downloadCourseVideos,
  coursesInQueue,
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
          {ALL_COURSES.map((course) => (
            <li key={course.id} className="course-card">
              <CourseListItem
                courseData={course}
                userCourse={userCourses[course.id]}
                videoStatus={videoStatus[course.id]}
                removeCourse={() => removeCourse(course.id)}
                downloadCourse={() => downloadCourse(course.id, course.file)}
                downloadCourseVideos={downloadCourseVideos}
                inQueue={coursesInQueue.has(course.id)}
              />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
