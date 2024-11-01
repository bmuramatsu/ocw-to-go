import React from "react";
import { Link } from "wouter";
import { CourseData, newUserCourse, UserCourse, VideoStatus } from "../types";
import { Checkmark, Download, Loader, Trash } from "./svgs";
import CourseLink from "./course_link";

interface Props {
  courseData: CourseData;
  userCourse: UserCourse | null;
  downloadCourse: () => void;
  removeCourse: () => void;
  downloadCourseVideos: (videoStatus: VideoStatus) => void;
  videoStatus: VideoStatus | null;
}

export default function CourseListItem({
  courseData,
  userCourse: maybeUserCourse,
  downloadCourse,
  removeCourse,
  downloadCourseVideos,
  videoStatus,
}: Props) {
  const userCourse = maybeUserCourse || newUserCourse(courseData.id);

  return (
    <>
      <CourseLink
        userCourse={userCourse}
        className="course-card__img"
        aria-hidden
        tabIndex={-1}
      >
        <img loading="lazy" src={courseData.cardImg} alt="alt text" />
      </CourseLink>
      <div className="course-card__content">
        <p className="u-all-caps">{courseData.courseLevel}</p>
        <h3>
          <CourseLink userCourse={userCourse}>{courseData.name}</CourseLink>
        </h3>
        <p className="u-mt-12">
          <span>Instructor:</span> {courseData.instructors.join(", ")}
        </p>
        <p className="u-mt-8">
          <span>Topics:</span> {courseData.topics.join(", ")}
        </p>
      </div>
      <div className="course-card__actions">
        {!userCourse.ready && userCourse.status == "" && (
          <button onClick={downloadCourse} className="btn--has-icon">
            <Download />
            Course
          </button>
        )}
        {!userCourse.ready && userCourse.status != "" && (
          <button className="btn--has-icon is-downloading" disabled>
            <Loader />
            Course
          </button>
        )}
        {userCourse.ready && (
          <Link href={`/courses/${courseData.id}`} className="btn--is-link">
            View Course
          </Link>
        )}

        {videoStatus && !!videoStatus.total && (
          <>
            {videoStatus.status === "unstarted" && (
              <button
                onClick={() => downloadCourseVideos(videoStatus)}
                className="btn--has-icon"
              >
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
                {videoStatus.videos.length} Videos
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
