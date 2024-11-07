import React from "react";
import { CourseData, newUserCourse } from "../types";
import { Cancel, Checkmark, Download, Loader, Trash } from "./svgs";
import CourseLink from "./course_link";
import useDownloadCourse from "./use_download_course";
import { useDownloadVideos } from "./video_downloader_context";
import useRemoveCourse from "./use_remove_course";
import { useAppSelector } from "./store/store";

interface Props {
  courseData: CourseData;
}

export default function CourseListItem({ courseData }: Props) {
  const userCourse =
    useAppSelector(({ user }) => user.userCourses[courseData.id]) ||
    newUserCourse(courseData.id);
  const videoStatus = useAppSelector(
    ({ user }) => user.courseVideos[courseData.id],
  );
  const inQueue = useAppSelector(
    ({ user }) =>
      !!user.videoQueue.find(({ courseId }) => courseId === courseData.id),
  );

  const downloadCourse = useDownloadCourse(courseData);
  const removeCourse = useRemoveCourse(courseData.id);
  const videoDownloader = useDownloadVideos();

  function confirmRemove() {
    if (
      window.confirm(
        "This will delete the course and all downloaded videos, are you sure you want to proceed?",
      )
    ) {
      removeCourse();
    }
  }

  return (
    <>
      <CourseLink
        userCourse={userCourse}
        className="course-card__img"
        aria-hidden
        tabIndex={-1}
      >
        <img
          loading="lazy"
          src={courseData.cardImg}
          alt={courseData.imgAltText}
        />
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

        {userCourse.ready && (
          <p className="u-mt-12 inline-icon">
            <Checkmark />
            Course downloaded
          </p>
        )}
        {videoStatus && !!videoStatus.total && (
          <p className="u-mt-8 inline-icon">
            {videoStatus.finished === videoStatus.total && <Checkmark />}
            {videoStatus.finished}/{videoStatus.total} videos downloaded
          </p>
        )}
      </div>
      <div className="course-card__actions">
        {!userCourse.ready && userCourse.status == "" && (
          <button onClick={downloadCourse} className="btn--has-icon is-primary">
            <Download />
            Download Course
          </button>
        )}
        {!userCourse.ready && userCourse.status != "" && (
          <button className="btn--has-icon is-primary is-downloading" disabled>
            <Loader />
            Downloading Course
          </button>
        )}

        {videoStatus && !!videoStatus.total && (
          <>
            {inQueue ? (
              <div className="combo-btn">
                <button className="btn--has-icon is-downloading" disabled>
                  <Loader />
                  Downloading Videos
                </button>
                <button
                  className="icon-btn"
                  onClick={() => videoDownloader.cancelDownload(userCourse.id)}
                >
                  <Cancel />
                </button>
              </div>
            ) : videoStatus.total !== videoStatus.finished ? (
              <button
                onClick={() => videoDownloader.addCourseToQueue(videoStatus)}
                className="btn--has-icon"
              >
                <Download />
                Download Videos
              </button>
            ) : null}
          </>
        )}
        {userCourse.ready && (
          <button onClick={confirmRemove} className="btn--has-icon">
            <Trash />
            Delete
          </button>
        )}
      </div>
    </>
  );
}
