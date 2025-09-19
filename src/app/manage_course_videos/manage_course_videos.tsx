import React from "react";
import { COURSES_BY_ID } from "../initial_course_list";
import CourseVideo from "./course_video";
import DownloadAllVideos from "./download_all_videos";
import { VideoData } from "../../types";
import { ChevronRight, Info } from "../svgs";
import { Link } from "wouter";

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
      <section className="section-padding">
        <div className="main__contain">
          <p className="h4">
            <Link
              className="course-video-back"
              href={`/courses/${courseData.id}`}
            >
              <ChevronRight />
              {courseData.name}
            </Link>
          </p>
          <h1 className="h1 u-mb-8">Course Videos</h1>
        </div>
      </section>
      <section className="bg--gray u-pb-72">
        <div className="main__contain no-padding">
          <div className="flat-card">
            <div className="flex align-center gap-12">
              <Info />
              <p className="text">
                Download course videos to access them offline
              </p>
            </div>
            <DownloadAllVideos courseId={courseId} />
          </div>
          {Array.from(videoGroups).map(([category, videos]) => (
            <React.Fragment key={category}>
              <h2 className="video-header">{category}</h2>
              <div className="video-list u-mt-16">
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
        </div>
      </section>
    </main>
  );
}
