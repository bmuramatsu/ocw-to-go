import React from "react";
import { COURSES_BY_ID } from "../initial_course_list";
import CourseVideo from "./course_video";
import DownloadAllVideos from "./download_all_videos";

interface Props {
  courseId: string;
}

// This is the main layout page for video downloads
export default function ManageCourseVideos({ courseId }: Props) {
  const courseData = COURSES_BY_ID[courseId];

  return (
    <main>
      <div className="flex wrap flex-end align-center">
        <h1 className="flex-1 u-min-300">{courseData.name}: Videos</h1>
        <DownloadAllVideos courseId={courseId} />
      </div>
      <h2 className="video-header">Lecture Videos</h2>
      <div className="video-list u-mt-12">
        {courseData.videos.map((video) => (
          <CourseVideo
            key={video.youtubeKey}
            courseId={courseId}
            video={video}
          />
        ))}
      </div>
    </main>
  );
}
