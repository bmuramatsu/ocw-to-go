import React from "react";
import { CourseData } from "../types";
import { useFormattedBytes } from "./utils/format_bytes";
import { useAppSelector } from "./store/store";
import { selectCourseVideoUsage } from "./store/video_selectors";

interface Props {
  course: CourseData;
}

export default function CourseVideoUsage({ course }: Props) {
  const videoStatus = useAppSelector((s) =>
    selectCourseVideoUsage(s, course.id),
  );

  const formattedVideoSpace = useFormattedBytes(videoStatus.usedSpace);

  return (
    <>
      {videoStatus.finishedVideos}/{videoStatus.totalVideos} videos downloaded (
      {formattedVideoSpace})
    </>
  );
}
