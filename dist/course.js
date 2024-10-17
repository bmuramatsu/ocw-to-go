"use strict";
(() => {
  // src/course.ts
  console.log("navigated", document.location.href);
  function overrideHomeButton() {
    document.querySelectorAll("[href='https://ocw.mit.edu/']").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.parent.postMessage({ type: "goBack" });
      });
    });
  }
  function overridePdfDownload() {
    const button = document.querySelector(".download-button-container .button-wrapper .download-file");
    if (!button) return;
    let href = button.getAttribute("href");
    if (href && href.startsWith("./static_resources")) {
      href = href.replace(/^\.\//, "../../");
      href = href + "?forcedownload=true";
      button.setAttribute("href", href);
    }
  }
  async function injectOfflineVideos() {
    console.log(await caches.keys());
    const downloadButton = document.querySelector('.video-player-wrapper [aria-label="Download video"]');
    if (!downloadButton) return;
    const wrapper = document.querySelector(".video-player-wrapper");
    const href = downloadButton.getAttribute("href");
    if (!href) return;
    const exists = await caches.match(href);
    if (!exists) return;
    wrapper.style.display = "none";
    const video = document.createElement("video");
    video.style.width = "100%";
    video.controls = true;
    const source = document.createElement("source");
    source.type = "video/mp4";
    source.src = href;
    video.appendChild(source);
    document.querySelector(".video-player-wrapper").after(video);
  }
  function init() {
    overrideHomeButton();
    overridePdfDownload();
    injectOfflineVideos();
  }
  init();
})();
//# sourceMappingURL=course.js.map
