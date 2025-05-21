import React from "react";
import { createPortal } from "react-dom";
import CourseVideo, {
  CourseVideoProps,
} from "./manage_course_videos/course_video";
import { VideoData } from "../types";
import VideoPlayer from "./video_player";
import { useAppSelector } from "./store/store";
import { selectVideoStatus } from "./store/video_selectors";

interface Props {
  courseId: string;
  currentVideo: VideoData;
  iframe: HTMLIFrameElement;
}

// This renders the controls to download/delete videos from within the course iframe.
// Because it's same-origin, react portals have no problem rendering inside the iframe,
// including providing access to Redux and other context.
// This is easier that managing the state updates in the DOM manually
export default function VideoDownloadPortal({
  courseId,
  currentVideo,
  iframe,
}: Props) {
  const target = iframe.contentWindow?.document.getElementById(
    `download-video-portal-${currentVideo.youtubeKey}`,
  )?.shadowRoot;

  if (!target) {
    return null;
  }

  return createPortal(
    <>
      <link rel="stylesheet" href="/video-downloader-styles.css" />
      <VideoBanner video={currentVideo} courseId={courseId} />
      <VideoPlayer video={currentVideo} courseId={courseId} />
    </>,
    target,
  );
}

// Renders the course download banner, but also checks if the user is offline
function VideoBanner(props: CourseVideoProps) {
  const { courseId, video } = props;
  const { status } = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  const offline = !navigator.onLine;
  const showOffline = status !== "ready" && offline;

  if (showOffline) {
    return (
      <p className="offline-message">
        Viewing and downloading videos requires an internet connection
      </p>
    );
  }

  return (
    <div className="video-list">
      <CourseVideo {...props} />
    </div>
  );
}
