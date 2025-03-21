import React from "react";
import * as customActions from "../store/custom_actions";
import * as asyncActions from "../store/async_actions";
import { useAppDispatch } from "../store/store";
import { useAppSelector } from "../store/store";
import { selectCourseVideoStatus } from "../store/video_selectors";
import { COURSES_BY_ID } from "../initial_course_list";

interface Props {
  courseId: string;
}

// This is the button to manage all videos for a course
export default function DownloadAllVideos({ courseId }: Props) {
  const dispatch = useAppDispatch();
  const removeCourseVideos = () =>
    dispatch(asyncActions.removeCourseVideos(courseId));
  const courseData = COURSES_BY_ID[courseId];
  const courseVideos = useAppSelector((state) =>
    selectCourseVideoStatus(state, courseId),
  );

  const total = courseData.videos.length;
  const finished = Object.values(courseVideos).filter(
    (video) => video?.status === "ready",
  ).length;

  if (total === finished) {
    return <button onClick={removeCourseVideos}>Delete all videos</button>;
  }

  const inQueue = Object.values(courseVideos).every(
    (video) => video?.status !== "none",
  );

  if (inQueue) {
    return (
      <>
        <div>Downloading...</div>
        <button
          onClick={() =>
            dispatch(customActions.cancelCourseDownload({ courseId }))
          }
        >
          Cancel
        </button>
      </>
    );
  }

  return (
    <button
      onClick={() => dispatch(customActions.downloadCourseVideos(courseData))}
    >
      Download All
    </button>
  );
}
