import React from "react";
import * as customActions from "../store/custom_actions";
import * as asyncActions from "../store/async_actions";
import { useAppDispatch } from "../store/store";
import { useAppSelector } from "../store/store";
import { selectCourseVideoUsage } from "../store/video_selectors";
import { Cancel, Download, Loader, Trash } from "../svgs";
import { COURSES_BY_ID } from "../initial_course_list";
import { useFormattedBytes } from "../utils/format_bytes";

interface Props {
  courseId: string;
}

// This is the button to manage all videos for a course
export default function DownloadAllVideos({ courseId }: Props) {
  const dispatch = useAppDispatch();
  const removeCourseVideos = () =>
    dispatch(asyncActions.removeCourseVideos(courseId));
  const courseData = COURSES_BY_ID[courseId];

  const videoUsage = useAppSelector((state) =>
    selectCourseVideoUsage(state, courseId),
  );
  const formattedSpace = useFormattedBytes(videoUsage.totalSpace);

  if (videoUsage.totalVideos === videoUsage.finishedVideos) {
    return (
      <button className="icon-btn icon-btn--outlined is-red" onClick={removeCourseVideos}>
        <Trash />
      </button>
    );
  }

  if (videoUsage.allQueued) {
    return (
      <div className="combo-btn">
        <div className="btn btn--primary-black-outlined has-icon is-downloading">
          <Loader />
          Downloading...
        </div>
        <button
          className="icon-btn icon-btn--outlined"
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
      className="btn btn--primary-black-outlined has-icon"
      onClick={() => dispatch(customActions.downloadCourseVideos(courseData))}
    >
      <Download />
      Download all ({formattedSpace})
    </button>
  );
}
