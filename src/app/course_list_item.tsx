import React from "react";
import { Link } from "wouter";
import { CourseData, newUserCourse } from "../types";
import { Checkmark, Download, Loader, Trash } from "./svgs";
import CourseLink from "./course_link";
import useDownloadCourse from "./use_download_course";
import { useDownloadVideos } from "./video_downloader_context";
import useRemoveCourse from "./use_remove_course";
import { useAppSelector } from "./store/store";

interface Props {
  courseData: CourseData;
}

export default function CourseListItem({ courseData }: Props) {
  const userCourse = useAppSelector(
    ({ user }) =>
      user.userCourses[courseData.id] || newUserCourse(courseData.id),
  );
  const videoStatus = useAppSelector(
    ({ user }) => user.courseVideos[courseData.id],
  );
  const inQueue = useAppSelector(
    ({ user }) =>
      !!user.videoQueue.find(({ courseId }) => courseId === courseData.id),
  );

  const downloadCourse = useDownloadCourse(courseData);
  const removeCourse = useRemoveCourse(courseData.id);
  const downloadCourseVideos = useDownloadVideos();

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
            {inQueue ? (
              <button className="btn--has-icon is-downloading" disabled>
                <Loader />
                {videoStatus.finished}/{videoStatus.total} Videos
              </button>
            ) : videoStatus.total !== videoStatus.finished ? (
              <button
                onClick={() => downloadCourseVideos(videoStatus)}
                className="btn--has-icon"
              >
                <Download />
                {videoStatus.finished > 0 && <>{videoStatus.finished}/</>}
                {videoStatus.total} Videos
              </button>
            ) : (
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
