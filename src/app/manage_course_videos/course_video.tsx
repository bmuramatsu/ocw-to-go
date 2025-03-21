import React from "react";
import { VideoData } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import * as customActions from "../store/custom_actions";
import { selectVideoStatus, FullUserVideo } from "../video_selectors";
import { useDeleteVideo } from "../use_remove_course";

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
      {video.title}
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
  const deleteVideo = useDeleteVideo(courseId, videoId);

  switch (videoStatus.status) {
    case "ready":
      return <button onClick={() => deleteVideo()}>Delete</button>;
    case "downloading":
    case "waiting":
      return (
        <>
          <p>{videoStatus.status === "downloading" ? "Downloading" : "Waiting..."}</p>
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

//function StatusIcon() {}
