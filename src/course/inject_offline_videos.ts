import env from "./env";

export default async function injectOfflineVideos() {
  const videoPlayer = document.querySelector<HTMLElement>(
    ".video-player-wrapper [data-setup*='youtube.com']",
  );
  if (!videoPlayer) return;

  const match = videoPlayer.dataset.setup!.match(
    /youtube.com\/embed\/([a-zA-Z0-9_-]+)/,
  );
  if (!match || !match[1]) return;
  const code = match[1];

  const href = `/course-videos/${env.courseId}/${code}.mp4`;
  const exists = await caches.match(href);
  if (!exists) return;

  // We know we have a local copy at this point, so swap the iframe out for a video element
  const wrapper = document.querySelector<HTMLElement>(".video-player-wrapper")!;
  wrapper.style.display = "none";

  const video = document.createElement("video");

  video.style.width = "100%";
  video.controls = true;

  const source = document.createElement("source");
  source.type = "video/mp4";
  source.src = href;
  video.appendChild(source);

  wrapper.after(video);
}
