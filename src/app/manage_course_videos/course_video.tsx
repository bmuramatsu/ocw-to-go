import React from "react";
import { Download, Loader, Checkmark, Cancel, Trash } from "../svgs";
import { VideoData } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import * as customActions from "../store/custom_actions";
import * as asyncActions from "../store/async_actions";
import { selectVideoStatus, FullUserVideo } from "../store/video_selectors";
import { useFormattedBytes } from "../utils/format_bytes";

interface Props {
  courseId: string;
  video: VideoData;
}

// this component is a single video on the downloads page
export default function CourseVideo({ courseId, video }: Props) {
  const videoStatus = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  const bytes = useFormattedBytes(video.contentLength);

  return (
    <div key={video.youtubeKey} className="video-list__item">
      <StatusIcon videoStatus={videoStatus} />
      <div className="video-list__item__content">
        <h3>{video.title}</h3>
        <p>{bytes}</p>
      </div>
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
  const deleteVideo = () =>
    dispatch(asyncActions.deleteVideo(courseId, videoId));

  switch (videoStatus.status) {
    case "ready":
      return (
        <button className="btn--has-icon" onClick={() => deleteVideo()}>
          <Trash />
          Delete
        </button>
      );
    case "downloading":
    case "waiting":
      return (
        <div className="combo-btn">
          <div className="btn--has-icon is-downloading">
            <Loader />
            {videoStatus.status === "downloading"
              ? "Downloading"
              : "Waiting..."}
          </div>
          <button
            className="icon-btn"
            onClick={() =>
              dispatch(customActions.cancelVideoDownload({ courseId, videoId }))
            }
          >
            <Cancel />
          </button>
        </div>
      );
    default:
      return (
        <button
          className="btn--has-icon"
          onClick={() =>
            dispatch(customActions.downloadVideo({ courseId, videoId }))
          }
        >
          <Download />
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
      return (
        <div className="video-list__graphic is-green">
          <div>VIDEO</div>
          <span>
            <Checkmark />
          </span>
        </div>
      );
    case "downloading":
      return (
        <div className="video-list__graphic is-loading">
          <div>VIDEO</div>
          <span>
            <Loader />
          </span>
        </div>
      );
    case "waiting":
      return (
        <div className="video-list__graphic is-loading">
          <div>VIDEO</div>
          <span>
            <Loader />
          </span>
        </div>
      );
    default:
      return (
        <div className="video-list__graphic is-red">
          <div>VIDEO</div>
          <span>
            <Download />
          </span>
        </div>
      );
  }
}
