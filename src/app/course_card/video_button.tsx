import React from "react";
import { Link } from "wouter";
import { CourseData } from "../../types";
import { Checkmark, Videos } from "../svgs";
import { useAppSelector } from "../store/store";
import { selectCourseVideoUsage } from "../store/video_selectors";
import { useFormattedBytes } from "../utils/format_bytes";

interface VideoButtonProps {
  courseData: CourseData;
}

export default function VideoButton({ courseData }: VideoButtonProps) {
  const usage = useAppSelector((s) => selectCourseVideoUsage(s, courseData.id));

  const usedSpace = useFormattedBytes(usage.usedSpace);
  const totalSpace = useFormattedBytes(usage.totalSpace);

  return (
    <Link className="btn--has-icon" href={`/manage_videos/${courseData.id}`}>
      Manage Videos
      <p className="u-mt-8 inline-icon">
        {usage.finishedVideos === usage.totalVideos && <Checkmark />}
        {usage.finishedVideos}/{usage.totalVideos} videos downloaded (
        {usedSpace} / {totalSpace})
      </p>
      <Videos />
    </Link>
  );
}
