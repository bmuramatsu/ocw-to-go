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
    <main>
      <div className="flex wrap space-between align-center">
        <h1 className="flex-1 u-min-300">{courseData.name}: Videos</h1>
        <DownloadAllVideos courseId={courseId} />
      </div>
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
