import React from "react";
import { COURSES_BY_ID } from "../initial_course_list";
import CourseVideo from "./course_video";
import DownloadAllVideos from "./download_all_videos";
import CourseVideoUsage from "../course_video_usage";
import { VideoData } from "../../types";

interface Props {
  courseId: string;
}

// This is the main layout page for video downloads
export default function ManageCourseVideos({ courseId }: Props) {
  const courseData = COURSES_BY_ID[courseId];

  const videoGroups = React.useMemo(() => {
    const groups: Map<string, VideoData[]> = new Map();

    courseData.videos.forEach((video) => {
      const category = video.category;

      if (groups.get(category)) {
        groups.get(category)!.push(video);
      } else {
        groups.set(category, [video]);
      }
    });
    return groups;
  }, [courseData]);

  return (
    <main>
      <div className="flex wrap flex-end">
        <h1 className="h1 flex-1 u-min-300">{courseData.name}: Videos</h1>
        <div className="flex align-end flex-column">
          <DownloadAllVideos courseId={courseId} />
          <p className="text">
            <CourseVideoUsage course={courseData} />
          </p>
        </div>
      </div>
      {Array.from(videoGroups).map(([category, videos]) => (
        <React.Fragment key={category}>
          <h2 className="video-header">{category}</h2>
          <div className="video-list u-mt-12">
            {videos.map((video) => (
              <CourseVideo
                key={video.youtubeKey}
                courseId={courseId}
                video={video}
                withLink
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </main>
  );
}
