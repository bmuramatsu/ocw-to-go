// This is a course card, which displays metadata about the course,
// and status information about the state of the course download.
import React from "react";
import { CourseData, CourseStatus, newUserCourse } from "../types";
import { Checkmark, Download, Loader, Trash } from "./svgs";
import CourseLink from "./course_link";
import useDownloadCourse from "./use_download_course";
import * as asyncActions from "./use_remove_course";
import { useAppDispatch, useAppSelector } from "./store/store";
import { Link } from "wouter";
import { selectCourseVideoStatus } from "./video_selectors";

function downloadState(state: CourseStatus) {
  switch (state) {
    case "none":
    case "error":
      return "download";
    case "downloading":
    case "preparing":
      return "downloading";
    case "ready":
      return "ready";
  }
}

interface Props {
  courseData: CourseData;
}

export default function CourseCard({ courseData }: Props) {
  const userCourse =
    useAppSelector(({ user }) => user.userCourses[courseData.id]) ||
    newUserCourse();

  const videoStatus = useAppSelector((s) =>
    selectCourseVideoStatus(s, courseData.id),
  );

  const totalVideos = courseData.videos.length;
  let finishedVideos = 0;

  Object.values(videoStatus).forEach((video) => {
    if (video?.status == "ready") finishedVideos++;
  });

  const downloadCourse = useDownloadCourse(courseData);
  const dispatch = useAppDispatch();
  const removeCourse = () => dispatch(asyncActions.removeCourse(courseData.id));

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

  return (
    <>
      <CourseLink
        ready={state === "ready"}
        courseId={courseData.id}
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
          <CourseLink ready={state === "ready"} courseId={courseData.id}>
            {courseData.name}
          </CourseLink>
        </h3>
        <p className="u-mt-12">
          <span>Instructor:</span> {courseData.instructors.join(", ")}
        </p>
        <p className="u-mt-8">
          <span>Topics:</span> {courseData.topics.join(", ")}
        </p>

        {state === "ready" && (
          <p className="u-mt-12 inline-icon">
            <Checkmark />
            Course downloaded
          </p>
        )}
        {state === "ready" && !!totalVideos && (
          <p className="u-mt-8 inline-icon">
            {finishedVideos === totalVideos && <Checkmark />}
            {finishedVideos}/{totalVideos} videos downloaded
          </p>
        )}
      </div>
      <div className="course-card__actions">
        {state === "download" && (
          <button onClick={downloadCourse} className="btn--has-icon is-primary">
            <Download />
            Download Course
          </button>
        )}
        {state === "downloading" && (
          <button className="btn--has-icon is-primary is-downloading" disabled>
            <Loader />
            Downloading Course
          </button>
        )}

        {state === "ready" && (
          <>
            <Link href={`/manage_videos/${courseData.id}`}>Manage Videos</Link>
            <button onClick={confirmRemove} className="btn--has-icon">
              <Trash />
              Delete
            </button>
          </>
        )}
      </div>
    </>
  );
}
