import React from "react";
import CourseVideo, { CourseVideoProps } from "../course_video";
import { Info } from "../svgs";
import VideoPlayer from "../video_player";
import { useAppSelector } from "../store/store";
import { selectVideoStatus } from "../store/video_selectors";
import { useOnlineStatus } from "../use_online_status";
import { VideoPlayerProps } from "../../common/custom_elements/video_player";

interface VideoDownloadPortalProps extends VideoPlayerProps {
  courseId: string;
}

// This renders the controls to download/delete videos from within the course iframe.
// Because it's same-origin, react portals have no problem rendering inside the iframe,
// including providing access to Redux and other context.
// This is easier that managing the state updates in the DOM manually
export default function VideoDownloadPortal({
  courseId,
  video,
  timeRange,
}: VideoDownloadPortalProps) {
  const stylesPath = APP_ASSET_MANIFEST["/video-downloader-styles.css"];
  return (
    <>
      <link rel="stylesheet" href={stylesPath} />
      <VideoBanner video={video} courseId={courseId} />
      <VideoPlayer video={video} courseId={courseId} timeRange={timeRange} />
    </>
  );
}

// Renders the course download banner, but also checks if the user is offline
function VideoBanner(props: CourseVideoProps) {
  const { courseId, video } = props;
  const { status } = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  const online = useOnlineStatus();
  const showOffline = status !== "ready" && !online;

  if (showOffline) {
    return (
      <p className="offline-message">
        Viewing and downloading videos requires an internet connection
      </p>
    );
  }

  return (
    <div className="video-list">
      {status !== "ready" && (
        <div className="video-list__banner">
          <Info />
          <p className="text">Download course videos to access them offline</p>
        </div>
      )}
      <CourseVideo {...props} />
    </div>
  );
}
