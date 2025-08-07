import React from "react";
import { Link } from "wouter";
import { CourseData } from "../../types";
import { Checkmark, ChevronRight } from "../svgs";
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
    <Link className="btn btn--manage" href={`/manage_videos/${courseData.id}`}>
      <div className="flex flex-column">
        Manage Videos
        <p>
          {usage.finishedVideos === usage.totalVideos && <Checkmark />}
          {usage.finishedVideos}/{usage.totalVideos} videos (
          {usedSpace} / {totalSpace})
        </p>
      </div>
      <ChevronRight />
    </Link>
  );
}
