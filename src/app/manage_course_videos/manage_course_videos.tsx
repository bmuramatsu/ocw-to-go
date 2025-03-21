import React from "react";
import { COURSES_BY_ID } from "../initial_course_list";
import CourseVideo from "./course_video";
import DownloadAllVideos from "./download_all_videos";

interface Props {
  courseId: string;
}

export default function ManageCourseVideos({ courseId }: Props) {
  const courseData = COURSES_BY_ID[courseId];

  return (
    <div>
      <h1>{courseData.name} Videos</h1>
      <DownloadAllVideos courseId={courseId} />

      <div>
        {courseData.videos.map((video) => (
          <CourseVideo
            key={video.youtubeKey}
            courseId={courseId}
            video={video}
          />
        ))}
      </div>
    </div>
  );
}
