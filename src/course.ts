console.log("navigated", document.location.href);

type ENV = {
  courseId: string;
};

// @ts-expect-error - This is injected by the parent window
const env = window.PWA as ENV;

function overrideHomeButton() {
  document.querySelectorAll("[href='https://ocw.mit.edu/']").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.parent.postMessage({ type: "goBack" });
    });
  });
}

function overridePdfDownload() {
  const button = document.querySelector(
    ".download-button-container .button-wrapper .download-file",
  );
  if (!button) return;

  let href = button.getAttribute("href")!;
  if (href.startsWith("./static_resources")) {
    href = href.replace(/^\.\//, "../../");
  }

  href = href + "?forcedownload=true";
  button.setAttribute("href", href);
}

function overridePdfThumbnailDownload() {
  const buttons = document.querySelectorAll(
    ".resource-thumbnail[href$='.pdf']",
  );
  buttons.forEach((button) => {
    let href = button.getAttribute("href")!;
    if (href.startsWith("./static_resources")) {
      href = href.replace(/^\.\//, "../../");
    }
    href = href + "?forcedownload=true";
    button.setAttribute("href", href);
    button.removeAttribute("download");
  });
}

async function injectOfflineVideos() {
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

function init() {
  overrideHomeButton();
  overridePdfDownload();
  overridePdfThumbnailDownload();
  injectOfflineVideos();
}

init();
