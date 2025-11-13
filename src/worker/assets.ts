// This lists application assets that need to be cached
// in order to make the app work offline.

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.ico",
  WORKER_ASSET_MANIFEST["/styles.css"],
  WORKER_ASSET_MANIFEST["/video-downloader-styles.css"],
  WORKER_ASSET_MANIFEST["/course-styles.css"],
  WORKER_ASSET_MANIFEST["/app.tsx"],
  WORKER_ASSET_MANIFEST["/course.ts"],
  "/manifest.json",
  "/icons/android/to-go-192-192.png",
  "/icons/android/to-go-icon.svg",
  "/images/facebook-icon.png",
  "/images/instagram-icon.png",
  "/images/x-icon.png",
  "/images/youtube-icon.png",
  "/images/ocwtogo-logo.svg",
  "/images/oeglobal.png",
  "/images/linkedin-icon.png",
  "/images/mit-logo.svg",
  "/images/mit-logo-sm.svg",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
];

export default ASSETS_TO_CACHE;
