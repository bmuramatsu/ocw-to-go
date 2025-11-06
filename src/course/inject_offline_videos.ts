// If the user has downloaded the video, this injects a video
// element into the page and hides the youtube player.
import broadcastChannel from "./course_channel";
import type { VideoData } from "../types";
import env from "./env";
import nextId from "./portal_id_generator";
import VideoPlayer from "../common/custom_elements/video_player";

export default function injectOfflineVideos() {
  const ids: string[] = [];

  document
    .querySelectorAll<HTMLElement>(
      ".video-player-wrapper .video-container [data-setup*='youtube.com']",
    )
    .forEach((videoPlayer) => {
      if (!videoPlayer) return;

      const youtubeSetupData = videoPlayer.dataset.setup!;
      const match = youtubeSetupData.match(
        /youtube.com\/embed\/([a-zA-Z0-9_-]+)/,
      );

      if (!match || !match[1]) return;

      const videoData = getVideoData(match[1]);
      if (!videoData) return;

      const timeRange = getTimeRange(youtubeSetupData);

      // The actual youtube player element gets replaced by other scripts, so we
      // use the closest stable parent to attach to instead.
      // We know this parent exists because it's part of the selector at the
      // beginning of the function
      const playerWrapper =
        videoPlayer.closest<HTMLElement>(".video-container")!;

      const id = nextId();
      const player = new VideoPlayer(id, { video: videoData, timeRange });
      playerWrapper.before(player);

      removeExistingDownloadLink();
      changeTranscriptButtonText();
      subscribeToPlayerState(videoData.youtubeKey, playerWrapper);

      ids.push(id);
    });

  broadcastChannel.postMessage({
    type: "portals-opened",
    ids: ids,
  });
}

function getVideoData(videoId: string): VideoData | undefined {
  return env.course.videos.find((v) => v.youtubeKey === videoId);
}

function getTimeRange(setupData: string): [number, number] | null {
  let json: { youtube?: { start?: number; end?: number } };
  try {
    json = JSON.parse(setupData);
  } catch {
    return null;
  }
  const { start, end } = json.youtube || {};
  if (start && end && start > -1) return [start, end];
  return null;
}

// This removes the existing video download button to avoid confusion
function removeExistingDownloadLink() {
  const link = document.querySelector<HTMLElement>(
    ".video-tab-download-popup li a[aria-label='Download video']",
  );
  link?.closest("li")?.remove();
}

function changeTranscriptButtonText() {
  const link = document.querySelector<HTMLElement>(
    ".video-tab-download-popup li a[aria-label='Download transcript']",
  );
  if (link) {
    link.textContent = "Save transcript";
  }
}

function subscribeToPlayerState(videoKey: string, wrapper: HTMLElement) {
  broadcastChannel.subscribe((message) => {
    if (
      message.type === "video-player-state-change" &&
      message.videoKey === videoKey
    ) {
      if (message.ready) {
        hideYoutubePlayer(wrapper);
      } else {
        showYoutubePlayer(wrapper);
      }
    }
  });
}

function hideYoutubePlayer(wrapper: HTMLElement) {
  wrapper.style.display = "none";
}

function showYoutubePlayer(wrapper: HTMLElement) {
  wrapper.style.display = "block";
}
