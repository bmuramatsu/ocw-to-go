import React from "react";
import { Download, Loader, Checkmark, Cancel, Trash, Play } from "../svgs";
import { VideoData } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import * as customActions from "../store/custom_actions";
import * as asyncActions from "../store/async_actions";
import { selectVideoStatus, FullUserVideo } from "../store/video_selectors";
import { useFormattedBytes } from "../utils/format_bytes";
import { Link } from "wouter";

export interface CourseVideoProps {
  courseId: string;
  video: VideoData;
  withLink?: boolean;
}

// this component is a single video on the downloads page
export default function CourseVideo({
  courseId,
  video,
  withLink = false,
}: CourseVideoProps) {
  const videoStatus = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  const bytes = useFormattedBytes(video.contentLength);

  return (
    <div key={video.youtubeKey} className="video-list__item">
      <StatusIcon videoStatus={videoStatus} />
      <div className="video-list__item__content">
        <h3>
          {withLink ? (
            <Link href={videoPath(courseId, video)}>{video.title}</Link>
          ) : (
            video.title
          )}
        </h3>
        <p>{bytes}</p>
      </div>
      <DownloadButton
        courseId={courseId}
        video={video}
        videoStatus={videoStatus}
        withLink={withLink}
      />
    </div>
  );
}

interface DownloadButtonProps {
  courseId: string;
  video: VideoData;
  videoStatus: FullUserVideo;
  withLink: boolean;
}
function DownloadButton({
  courseId,
  video,
  videoStatus,
  withLink,
}: DownloadButtonProps) {
  const videoId = video.youtubeKey;
  const dispatch = useAppDispatch();
  const deleteVideo = () =>
    dispatch(asyncActions.deleteVideo(courseId, videoId));

  switch (videoStatus.status) {
    case "ready":
      return (
        <div className="video-actions flex align-center gap-8">
          {withLink ? (
            <>
              <Link
                href={videoPath(courseId, video)}
                className="btn btn--primary-black has-icon"
              >
                <Play />
                Play video
              </Link>
              <button
                className="icon-btn icon-btn--outlined is-red"
                onClick={() => deleteVideo()}
              >
                <Trash />
              </button>
            </>
          ) : (
            <button
              className="btn btn--primary-outlined has-icon"
              onClick={() => deleteVideo()}
            >
              <Trash />
              Delete
            </button>
          )}
        </div>
      );
    case "downloading":
    case "waiting":
      return (
        <div className="video-actions">
          <div className="combo-btn">
            <div className="btn btn--primary-black-outlined has-icon is-downloading">
              <Loader />
              {videoStatus.status === "downloading"
                ? "Downloading"
                : "Waiting..."}
            </div>
            <button
              className="icon-btn icon-btn--outlined"
              onClick={() =>
                dispatch(
                  customActions.cancelVideoDownload({ courseId, videoId }),
                )
              }
            >
              <Cancel />
            </button>
          </div>
        </div>
      );
    default:
      return (
        <div className="video-actions flex flex-column align-end">
          <button
            className="btn btn--primary-black-outlined has-icon"
            onClick={() =>
              dispatch(customActions.downloadVideo({ courseId, videoId }))
            }
          >
            <Download />
            Download
          </button>
          {videoStatus.errorMessage && (
            <p className="error-message u-mt-8">{videoStatus.errorMessage}</p>
          )}
        </div>
      );
  }
}

function videoPath(courseId: string, video: VideoData): string {
  return `/courses/${courseId}/${video.htmlFile}`;
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
