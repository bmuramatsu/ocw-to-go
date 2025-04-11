import React from "react";
import { VideoData } from "../types";
import { useAppSelector } from "./store/store";
import { selectVideoStatus } from "./store/video_selectors";
import { useBroadcastChannel } from "./use_broadcast";

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

  React.useEffect(() => {
    console.log("Video player ready", ready);
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
