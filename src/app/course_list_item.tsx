import React from "react";
import { Link } from "wouter";
import { Course, VideoStatus } from "../types";
import { Checkmark, Download, Loader, Trash } from "./svgs";
import CourseLink from "./course_link";

interface Props {
  course: Course;
  downloadCourse: () => void;
  removeCourse: () => void;
  downloadCourseVideos: () => void;
  videoStatus: VideoStatus | null;
}

export default function CourseListItem({
  course,
  downloadCourse,
  removeCourse,
  downloadCourseVideos,
  videoStatus,
}: Props) {
  return (
    <>
      <CourseLink
        course={course}
        className="course-card__img"
        aria-hidden
        tabIndex={-1}
      >
        <img loading="lazy" src={course.cardImg} alt="alt text" />
      </CourseLink>
      <div className="course-card__content">
        <p className="u-all-caps">{course.courseLevel}</p>
        <h3>
          <CourseLink course={course}>{course.name}</CourseLink>
        </h3>
        <p className="u-mt-12">
          <span>Instructor:</span> {course.instructors.join(", ")}
        </p>
        <p className="u-mt-8">
          <span>Topics:</span> {course.topics.join(", ")}
        </p>
      </div>
      <div className="course-card__actions">
        {!course.ready && course.status == "" && (
          <button onClick={downloadCourse} className="btn--has-icon">
            <Download />
            Course
          </button>
        )}
        {!course.ready && course.status != "" && (
          <button className="btn--has-icon is-downloading" disabled>
            <Loader />
            Course
          </button>
        )}
        {course.ready && (
          <Link href={`/courses/${course.id}`} className="btn--is-link">
            View Course
          </Link>
        )}

        {videoStatus && !!videoStatus.total && (
          <>
            {videoStatus.status === "unstarted" && (
              <button onClick={downloadCourseVideos} className="btn--has-icon">
                <Download />
                {videoStatus.finished > 0 && <>{videoStatus.finished}/</>}
                {videoStatus.total} Videos
              </button>
            )}
            {videoStatus.status === "downloading" && (
              <button className="btn--has-icon is-downloading" disabled>
                <Loader />
                {videoStatus.finished}/{videoStatus.total} Videos
              </button>
            )}
            {videoStatus.status === "complete" && (
              <button className="btn--has-icon is-success" disabled>
                <Checkmark />
                {course.videos.length} Videos
              </button>
            )}
          </>
        )}
        <button onClick={removeCourse} className="icon-btn">
          <Trash />
        </button>
      </div>
    </>
  );
}
