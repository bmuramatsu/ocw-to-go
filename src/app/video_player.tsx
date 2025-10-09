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

  const [hasPlayed, setHasPlayed] = React.useState(false);

  // The script running in the page listens for this event and hides the youtube
  // player when the local video is rendered
  React.useEffect(() => {
    channel.postMessage({
      type: "video-player-state-change",
      ready,
      videoKey: video.youtubeKey,
    });
  }, [channel, ready, video.youtubeKey]);

  if (!ready) return null;

  function captionsPath(captionsFile: string) {
    const fileName = captionsFile.split("/").pop();
    return `/courses/${courseId}/static_resources/${fileName}`;
  }

  // iOS shows the captions before the video has started playing and it looks
  // bad. So we only show the captions after the user has played the video.
  const showCaptions = video.captionsFile && hasPlayed;

  return (
    <video controls onPlay={() => setHasPlayed(true)}>
      <source
        type="video/mp4"
        src={`/course-videos/${courseId}/${video.youtubeKey}.mp4`}
      />
      {showCaptions && (
        <track kind="captions" src={captionsPath(video.captionsFile!)} />
      )}
    </video>
  );
}
