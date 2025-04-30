import React from "react";
import { createPortal } from "react-dom";
import CourseVideo from "./manage_course_videos/course_video";
import { VideoData } from "../types";
import VideoPlayer from "./video_player";

interface Props {
  courseId: string;
  currentVideo: VideoData;
  iframe: HTMLIFrameElement;
}

// This renders the controls to downloads/delete videos from within the course iframe.
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
      <div className="video-list">
        <CourseVideo video={currentVideo} courseId={courseId} />
      </div>
      <VideoPlayer video={currentVideo} courseId={courseId} />
    </>,
    target,
  );
}
