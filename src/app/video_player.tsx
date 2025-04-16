import React from "react";
import { VideoData } from "../types";
import { useAppSelector } from "./store/store";
import { selectVideoStatus } from "./store/video_selectors";
import { useBroadcastChannel } from "./use_broadcast";

// This is rendered inside a portal in the course content, only if we detect that
// a local copy of the video is ready to be played
interface Props {
  courseId: string;
  video: VideoData;
}
export default function VideoPlayer({ courseId, video }: Props) {
  const videoStatus = useAppSelector((s) =>
    selectVideoStatus(s, courseId, video.youtubeKey),
  );

  const ready = videoStatus.status === "ready";

  const channel = useBroadcastChannel();

  // The script running in the page listens for this event and hides the youtube
  // player when the local video is rendered
  React.useEffect(() => {
    channel.postMessage({
      type: "video-player-state-change",
      ready,
    });
  }, [channel, ready]);

  if (!ready) return null;

  function captionsPath(captionsFile: string) {
    const fileName = captionsFile.split("/").pop();
    return `/courses/${courseId}/static_resources/${fileName}`;
  }

  return (
    <video style={{ width: "100%" }} controls>
      <source
        type="video/mp4"
        src={`/course-videos/${courseId}/${video.youtubeKey}.mp4`}
      />
      {video.captionsFile && (
        <track kind="captions" src={captionsPath(video.captionsFile)} />
      )}
    </video>
  );
}
