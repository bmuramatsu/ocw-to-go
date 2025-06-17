import React from "react";
import { VideoData } from "../types";
import { useAppSelector } from "./store/store";
import { selectVideoStatus } from "./store/video_selectors";
import { useBroadcastChannel } from "./use_broadcast";
import vtt from "vtt.js";

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
  const [cues2, setCues] = React.useState<vtt.VTTCue[]>([]);

  React.useEffect(() => {
    const loadCaptions = async () => {
      // If the video has captions, we need to fetch the captions file to ensure
      // that the browser can load it when the video starts playing.
      if (video.captionsFile) {
        const response = await fetch(
          captionsPath(courseId, video.captionsFile),
        );
        const text = await response.text();

        const { WebVTT, VTTCue, VTTRegion } = vtt;
        const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
        const cues = [];
        const regions = [];
        parser.oncue = function (cue) {
          cues.push(cue);
        };
        parser.onregion = function (region) {
          regions.push(region);
        };
        parser.parse(text);
        parser.flush();

        setCues(cues);

        console.log(cues);
        //var div = WebVTT.convertCueToDOMTree(window, cues[0].text);
        //var divs = WebVTT.processCues(
        //  window,
        //  cues,
        //  document.getElementById("captions"),
        //);
      }
    };

    loadCaptions();
  }, [courseId, video.captionsFile]);

  // The script running in the page listens for this event and hides the youtube
  // player when the local video is rendered
  React.useEffect(() => {
    channel.postMessage({
      type: "video-player-state-change",
      ready,
    });
  }, [channel, ready]);

  if (!ready) return null;

  // iOS shows the captions before the video has started playing and it looks
  // bad. So we only show the captions after the user has played the video.
  const showCaptions = video.captionsFile && hasPlayed;

  return (
    <>
      <video controls onPlay={() => setHasPlayed(true)}>
        <source
          type="video/mp4"
          src={`/course-videos/${courseId}/${video.youtubeKey}.mp4`}
        />
        {showCaptions && (
          <track
            kind="captions"
            src={captionsPath(courseId, video.captionsFile!)}
          />
        )}
      </video>
      <div id="captions">
        {cues2.map((cue, index) => (
          <div key={index} className="caption">
            {cue.text}
          </div>
        ))}
      </div>
    </>
  );
}
function captionsPath(courseId: string, captionsFile: string) {
  const fileName = captionsFile.split("/").pop();
  return `/courses/${courseId}/static_resources/${fileName}`;
}
