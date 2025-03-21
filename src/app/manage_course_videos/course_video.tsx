import React from "react";
import { VideoData } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import * as customActions from "../store/custom_actions";
import * as asyncActions from "../async_actions";
import { selectVideoStatus, FullUserVideo } from "../video_selectors";
import { formatBytes } from "../utils/format_bytes";

interface Props {
  courseId: string;
  video: VideoData;
}

export default function CourseVideo({ courseId, video }: Props) {
  const videoStatus = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  return (
    <div key={video.youtubeKey}>
      <hr />
      <StatusIcon videoStatus={videoStatus} />
      <h2>{video.title}</h2>
      <p>{formatBytes(video.contentLength)}</p>
      <DownloadButton
        courseId={courseId}
        videoId={video.youtubeKey}
        videoStatus={videoStatus}
      />
    </div>
  );
}

interface DownloadButtonProps {
  courseId: string;
  videoId: string;
  videoStatus: FullUserVideo;
}
function DownloadButton({
  courseId,
  videoId,
  videoStatus,
}: DownloadButtonProps) {
  const dispatch = useAppDispatch();
  const deleteVideo = () => dispatch(asyncActions.deleteVideo(courseId, videoId));

  switch (videoStatus.status) {
    case "ready":
      return <button onClick={() => deleteVideo()}>Delete</button>;
    case "downloading":
    case "waiting":
      return (
        <>
          <p>
            {videoStatus.status === "downloading"
              ? "Downloading"
              : "Waiting..."}
          </p>
          <button
            onClick={() =>
              dispatch(customActions.cancelVideoDownload({ courseId, videoId }))
            }
          >
            Cancel
          </button>
        </>
      );
    default:
      return (
        <button
          onClick={() =>
            dispatch(customActions.downloadVideo({ courseId, videoId }))
          }
        >
          Download
        </button>
      );
  }
}

interface StatusIconProps {
  videoStatus: FullUserVideo;
}
function StatusIcon({ videoStatus }: StatusIconProps) {
  switch (videoStatus.status) {
    case "ready":
      return <span>✅</span>;
    case "downloading":
      return <span>🔄</span>;
    case "waiting":
      return <span>⏳</span>;
    default:
      return <span>❌</span>;
  }
}
