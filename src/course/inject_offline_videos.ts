// If the user has downloaded the video, this injects a video
// elements into the page and hides the youtube player.
import OcwBroadcastChannel from "../common/broadcast_channel";
import type { VideoData } from "../types";
import { DownloadVideo, registerDownloadVideo } from "./download_element";
import env from "./env";

registerDownloadVideo();

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
  playerEl: HTMLElement;
  wrapper: HTMLElement;
  videoData: VideoData;
  downloadElement: DownloadVideo;

  constructor(playerEl: HTMLElement, videoData: VideoData) {
    this.channel = new OcwBroadcastChannel();
    this.playerEl = playerEl;
    this.videoData = videoData;
    this.wrapper = playerEl.closest(".video-player-wrapper")!;
    this.downloadElement = this.addDownloadElement();
    this.addPlayerIfExists();
    this.subscribeToVideoStatus();
  }

  get videoId() {
    return this.videoData.youtubeKey;
  }

  get videoPath() {
    return `/course-videos/${env.course.id}/${this.videoId}.mp4`;
  }

  async addPlayerIfExists() {
    const exists = await caches.match(this.videoPath);
    if (exists) {
      this.addVideoPlayer();
    }
  }

  addVideoPlayer() {
    // We know we have a local copy at this point, so swap the iframe out for a video element
    this.wrapper.style.display = "none";
    this.playerEl.remove();

    const video = document.createElement("video");

    video.style.width = "100%";
    video.controls = true;

    const source = document.createElement("source");
    source.type = "video/mp4";
    source.src = this.videoPath;
    video.appendChild(source);

    this.addCaptions(video);

    this.wrapper.after(video);
  }

  async addCaptions(video: HTMLVideoElement) {
    const videoData = getVideoData(this.videoId);
    if (!videoData || !videoData.captionsFile) return;

    const fileName = videoData.captionsFile.split("/").pop();
    const captionPath = `/courses/${env.course.id}/static_resources/${fileName}`;

    const track = document.createElement("track");
    track.kind = "captions";
    // language can be set, but I don't think there's a way to know for sure
    // what language the video or the captions are in
    // track.label = "English";
    // track.srclang = "en";
    track.src = captionPath;

    video.appendChild(track);

    // This turns the captions on by default, I don't know if that's what we want yet
    track.track.mode = "showing";
  }

  addDownloadElement() {
    const downloadElement = document.createElement(
      "download-video",
    ) as DownloadVideo;

    downloadElement.addEventListener("download-video", () => {
      this.channel.postMessage({
        type: "download-video",
        courseId: env.course.id,
        videoId: this.videoId,
      });
    });

    this.wrapper.before(downloadElement);
    return downloadElement;
  }

  subscribeToVideoStatus() {
    this.channel.onMessage((message) => {
      if (message.type == "course-video-status") {
        const video = message.videoStatus[this.videoId]
        if (video) {
          this.downloadElement.updateStatus(video);

          // I'm not sure if this is what we want to do, but it works
          if (video.status === "ready") {
            this.addVideoPlayer();
          }
        }
      }
    });
  }
}

function getVideoData(videoId: string): VideoData | undefined {
  return env.course.videos.find((v) => v.youtubeKey === videoId);
}
