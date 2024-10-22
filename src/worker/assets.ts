import { ALL_COURSES } from "../app/initial_course_list";

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/styles.css',
  '/app.js',
  '/course.js',
  '/manifest.json',
  '/icons/android/launchericon-192-192.png',
  '/icons/android/launchericon-512-512.png',
  '/images/facebook-icon.png',
  '/images/instagram-icon.png',
  '/images/x-icon.png',
  '/images/youtube-icon.png',
  '/images/mit-logo-sm.svg',
  '/images/oeglobal.png',
  '/images/linkedin-icon.png',
  '/images/mit-logo.svg',
  ...ALL_COURSES.map(course => course.cardImg),
];

export default ASSETS_TO_CACHE;
