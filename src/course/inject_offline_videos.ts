// If the user has downloaded the video, this injects a video
// element into the page and hides the youtube player.
import broadcastChannel from "./course_channel";
import type { VideoData } from "../types";
import env from "./env";

export default function injectOfflineVideos() {
  const allVideoData = [] as VideoData[];

  document
    .querySelectorAll<HTMLElement>(
      ".video-player-wrapper .video-container div[data-setup*='youtube.com']",
    )
    .forEach((videoPlayer) => {
      console.log("found video player", videoPlayer);
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

      // The actual youtube player element gets replaced by other scripts, so we
      // use the closest stable parent to attach to instead.
      // We know this parent exists because it's part of the selector at the
      // beginning of the function
      const playerWrapper =
        videoPlayer.closest<HTMLElement>(".video-container")!;

      new VideoInjector(playerWrapper, videoData);
      allVideoData.push(videoData);
    });

  broadcastChannel.postMessage({
    type: "video-portals-opened",
    videoData: allVideoData,
  });
}

export class VideoInjector {
  wrapper: HTMLElement;
  videoData: VideoData;

  constructor(playerEl: HTMLElement, videoData: VideoData) {
    this.videoData = videoData;
    this.wrapper = playerEl;
    this.addPortal();
    this.removeExistingDownloadLink();
    this.changeTranscriptButtonText();

    broadcastChannel.subscribe((message) => {
      if (
        message.type === "video-player-state-change" &&
        message.videoKey === this.videoId
      ) {
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
  }

  // This removes the existing video download button to avoid confusion
  removeExistingDownloadLink() {
    const link = document.querySelector<HTMLElement>(
      ".video-tab-download-popup li a[aria-label='Download video']",
    );
    link?.closest("li")?.remove();
  }

  changeTranscriptButtonText() {
    const link = document.querySelector<HTMLElement>(
      ".video-tab-download-popup li a[aria-label='Download transcript']",
    );
    if (link) {
      link.textContent = "Save transcript";
    }
  }
}

function getVideoData(videoId: string): VideoData | undefined {
  return env.course.videos.find((v) => v.youtubeKey === videoId);
}
