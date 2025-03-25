// This is a course card, which displays metadata about the course,
// and status information about the state of the course download.
import React from "react";
import { CourseData, CourseStatus, newUserCourse } from "../types";
import { Checkmark, Download, Loader, Trash, Videos } from "./svgs";
import CourseLink from "./course_link";
import downloadCourseAction from "./store/download_course_action";
import * as asyncActions from "./store/async_actions";
import { useAppDispatch, useAppSelector } from "./store/store";
import { Link } from "wouter";
import { selectCourseVideoStatus } from "./store/video_selectors";
import { useFormattedBytes } from "./utils/format_bytes";

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

  const totalVideoSpace = courseData.videos.reduce((total, video) => {
    if (videoStatus[video.youtubeKey]?.status === "ready") {
      return total + video.contentLength;
    }
    return total;
  }, 0);

  const formattedVideoSpace = useFormattedBytes(totalVideoSpace);
  const formattedCourseSize = useFormattedBytes(courseData.downloadSize);

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
        <p className="u-mt-8">
          <span>Course size:</span> {formattedCourseSize}
        </p>

        {state === "ready" && (
          <p className="u-mt-12 inline-icon">
            <Checkmark />
            Course downloaded ({formattedCourseSize})
          </p>
        )}
        {state === "ready" && !!totalVideos && (
          <p className="u-mt-8 inline-icon">
            {finishedVideos === totalVideos && <Checkmark />}
            {finishedVideos}/{totalVideos} videos downloaded (
            {formattedVideoSpace})
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
            <Link
              className="btn--has-icon"
              href={`/manage_videos/${courseData.id}`}
            >
              <Videos />
              Manage Videos
            </Link>
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
