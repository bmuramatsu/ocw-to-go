import { ALL_COURSES } from "../app/initial_course_list";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/styles.css",
  "/app.js",
  "/course.js",
  "/manifest.json",
  "/icons/android/to-go-192-192.png",
  "/icons/android/to-go-icon.svg",
  "/images/facebook-icon.png",
  "/images/instagram-icon.png",
  "/images/x-icon.png",
  "/images/youtube-icon.png",
  "/images/to-go-logo.svg",
  "/images/oeglobal.png",
  "/images/linkedin-icon.png",
  "/images/mit-logo.svg",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
  ...ALL_COURSES.map((course) => course.cardImg),
];

export default ASSETS_TO_CACHE;
