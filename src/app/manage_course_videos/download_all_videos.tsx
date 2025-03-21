import React from "react";
import * as customActions from "../store/custom_actions";
import { useAppDispatch } from "../store/store";
import { useAppSelector } from "../store/store";
import { Cancel, Download, Loader, Trash} from "../svgs";
import { selectCourseVideoStatus } from "../video_selectors";
import { COURSES_BY_ID } from "../initial_course_list";
import { useRemoveCourseVideos } from "../use_remove_course";

interface Props {
  courseId: string;
}

export default function DownloadAllVideos({ courseId }: Props) {
  const dispatch = useAppDispatch();
  const removeCourseVideos = useRemoveCourseVideos(courseId);
  const courseData = COURSES_BY_ID[courseId];
  const courseVideos = useAppSelector((state) =>
    selectCourseVideoStatus(state, courseId),
  );

  const total = courseData.videos.length;
  const finished = Object.values(courseVideos).filter(
    (video) => video?.status === "ready",
  ).length;

  if (total === finished) {
    return <button className="btn--has-icon" onClick={removeCourseVideos}><Trash />Delete All</button>;
  }

  const inQueue = Object.values(courseVideos).every(
    (video) => video?.status !== "none",
  );

  if (inQueue) {
    return (
      <div className="combo-btn">
        <div className="btn--has-icon is-downloading">
          <Loader />
          Downloading...
        </div>
        <button
          className="icon-btn"
          onClick={() =>
            dispatch(customActions.cancelCourseDownload({ courseId }))
          }
        >
          <Cancel />
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn--has-icon"
      onClick={() => dispatch(customActions.downloadCourseVideos(courseData))}
    >
      <Download />
      Download All (23.45 GB)
    </button>
  );
}
