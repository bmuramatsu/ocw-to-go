// If the user has downloaded the video, this injects a video
// elements into the page and hides the youtube player.
import OcwBroadcastChannel from "../common/broadcast_channel";
import type { VideoData } from "../types";
import env from "./env";

export default function injectOfflineVideos() {
  const videoPlayer = document.querySelector<HTMLElement>(
    ".video-player-wrapper [data-setup*='youtube.com']",
  );
  if (!videoPlayer) {
    return;
  }

  const match = videoPlayer.dataset.setup!.match(
    /youtube.com\/embed\/([a-zA-Z0-9_-]+)/,
  );

  if (!match || !match[1]) {
    return;
  }

  const videoData = getVideoData(match[1]);
  if (!videoData) {
    return;
  }

  new VideoInjector(videoPlayer, videoData);
}

export class VideoInjector {
  channel: OcwBroadcastChannel;
  wrapper: HTMLElement;
  videoData: VideoData;

  constructor(playerEl: HTMLElement, videoData: VideoData) {
    this.channel = new OcwBroadcastChannel();
    this.videoData = videoData;
    this.wrapper = playerEl.closest(".video-player-wrapper")!;
    this.addPortal();

    this.channel.subscribe((message) => {
      if (message.type === "video-player-state-change") {
        if (message.ready) {
          this.hideYoutubePlayer();
        } else {
          this.showYoutubePlayer();
        }
      }
    });
  }

  get videoId() {
    return this.videoData.youtubeKey;
  }

  get videoPath() {
    return `/course-videos/${env.course.id}/${this.videoId}.mp4`;
  }

  hideYoutubePlayer() {
    this.wrapper.style.display = "none";
  }

  showYoutubePlayer() {
    this.wrapper.style.display = "block";
  }

  addPortal() {
    const portalTarget = document.createElement("div");
    portalTarget.id = `download-video-portal-${this.videoId}`;
    // react will render into the shadow root in order to isolate styles
    portalTarget.attachShadow({ mode: "open" });
    this.wrapper.before(portalTarget);
    this.channel.postMessage({
      type: "portal-opened",
      videoData: this.videoData,
    });
  }
}

function getVideoData(videoId: string): VideoData | undefined {
  return env.course.videos.find((v) => v.youtubeKey === videoId);
}
