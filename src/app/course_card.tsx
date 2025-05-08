// This is a course card, which displays metadata about the course,
// and status information about the state of the course download.
import React from "react";
import { CourseData, CourseStatus } from "../types";
import {
  Checkmark,
  ChevronRight,
  Download,
  Globe,
  Loader,
  Trash,
  Videos,
} from "./svgs";
import CourseLink from "./course_link";
import downloadCourseAction from "./store/download_course_action";
import * as asyncActions from "./store/async_actions";
import { useAppDispatch, useAppSelector } from "./store/store";
import { Link } from "wouter";
import { selectCourseVideoStatus } from "./store/video_selectors";
import { useFormattedBytes } from "./utils/format_bytes";
import { selectUserCourse } from "./store/course_selectors";
import CourseVideoUsage from "./course_video_usage";

// This might go away when we add error states
function downloadState(state: CourseStatus) {
  switch (state) {
    case "none":
    case "error":
      return "download";
    case "downloading":
      return "downloading";
    case "preparing":
      return "preparing";
    case "ready":
      return "ready";
  }
}

interface Props {
  courseData: CourseData;
}

export default function CourseCard({ courseData }: Props) {
  const userCourse = useAppSelector((s) => selectUserCourse(s, courseData.id));

  const videoStatus = useAppSelector((s) =>
    selectCourseVideoStatus(s, courseData.id),
  );

  const totalVideos = courseData.videos.length;
  let finishedVideos = 0;

  Object.values(videoStatus).forEach((video) => {
    if (video?.status == "ready") finishedVideos++;
  });

  const zippedCourseSize = useFormattedBytes(courseData.downloadSize);
  const unzippedCourseSize = useFormattedBytes(courseData.diskSize);

  const dispatch = useAppDispatch();
  const removeCourse = () => dispatch(asyncActions.removeCourse(courseData.id));
  const downloadCourse = () => dispatch(downloadCourseAction(courseData));

  function confirmRemove() {
    if (
      window.confirm(
        "This will delete the course and all downloaded videos, are you sure you want to proceed?",
      )
    ) {
      removeCourse();
    }
  }

  const state = downloadState(userCourse.status);
  const downloadProgress = Math.round(userCourse.downloadProgress * 100);

  return (
    <>
      <CourseLink
        courseData={courseData}
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
          <CourseLink courseData={courseData}>{courseData.name}</CourseLink>
        </h3>
        <p className="u-mt-12">
          <span>Instructor:</span> {courseData.instructors.join(", ")}
        </p>
        <p className="u-mt-8">
          <span>Topics:</span> {courseData.topics.join(", ")}
        </p>
        <a
          href={`https://ocw.mit.edu/courses/${courseData.id}`}
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          <Globe />
          View online
        </a>
        {state !== "ready" ? (
          <p className="u-mt-8">
            <span>Download:</span> {zippedCourseSize}
          </p>
        ) : (
          <p className="u-mt-12 inline-icon">
            <Checkmark />
            Course downloaded ({unzippedCourseSize})
          </p>
        )}
        {state === "ready" && !!totalVideos && (
          <p className="u-mt-8 inline-icon">
            {finishedVideos === totalVideos && <Checkmark />}
            <CourseVideoUsage course={courseData} />
          </p>
        )}
      </div>
      <div className="course-card__actions">
        {state === "download" && (
          <>
            {userCourse.errorMessage && (
              <p className="error-message u-mb-4">{userCourse.errorMessage}</p>
            )}
            <button
              onClick={downloadCourse}
              className="btn--has-icon is-primary"
            >
              <Download />
              Download Course
            </button>
          </>
        )}
        {state === "downloading" && (
          <button className="btn--has-icon is-primary is-downloading" disabled>
            <Loader />
            Downloading Course ({downloadProgress}%)
          </button>
        )}
        {state === "preparing" && (
          <button className="btn--has-icon is-primary is-downloading" disabled>
            <Loader />
            Preparing Course
          </button>
        )}

        {state === "ready" && (
          <>
            <Link
              className="btn--has-icon"
              href={`/manage_videos/${courseData.id}`}
            >
              <Videos />
              Manage Videos
            </Link>
            <button onClick={confirmRemove} className="btn--has-icon">
              <Trash />
              Delete Course and Videos
            </button>
            <CourseLink
              courseData={courseData}
              className="btn--has-icon is-primary icon-right"
            >
              View Course
              <ChevronRight />
            </CourseLink>
          </>
        )}
      </div>
    </>
  );
}
