// If the user has downloaded the video, this injects a video
// elements into the page and hides the youtube player.
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

  const href = `/course-videos/${env.course.id}/${code}.mp4`;
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

  addCaptions(video, code);

  wrapper.after(video);
}

async function addCaptions(video: HTMLVideoElement, youtubeKey: string) {
  const videoData = env.course.videos.find((v) => v.youtubeKey === youtubeKey);
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
