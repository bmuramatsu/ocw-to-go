import { createPartialResponse } from 'workbox-range-requests';
import { Course } from './types';
import { eachOfLimit } from 'async';

export type {};
declare const self: ServiceWorkerGlobalScope;

console.log("The Worker Ran");

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/styles/pico.min.css',
  '/app.js',
  '/course.js',
  '/manifest.json',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
];

self.addEventListener('install', event => {
  console.log("The Worker Installed", event);
  event.waitUntil((async () => {
    const cache = await caches.open("pwa-assets");
    await cache.addAll(ASSETS_TO_CACHE);
  })()); 
  // Activate worker immediately
  self.skipWaiting()
});

self.addEventListener('activate', event => {
  console.log("The Worker Activated", event);
  
  // Become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event: FetchEvent) => {
  console.log("The Worker Fetched", event.request.url);
  event.respondWith(cacheFirst(event.request));
});

addEventListener('message', event => {
  console.log("The Worker Received a Message", event);
  if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
    if (event.data.type === 'downloadVideos') {
      downloadVideos(event.data.course, event.source!);
    }
  }
});

async function cacheFirst(request: Request) {
  // return (await caches.match(request)) || await fetch(request);
  return (await fileFromCache(request)) || await fetch(request);
}

async function fileFromCache(request: Request): Promise<Response | undefined> {
  // handle special file downloads
  const url = new URL(request.url);
  if (url && url.search.includes('forcedownload=true')) {
    url.search = '';
    const response = await caches.match(url);
    if (response) {
      const fileName = url.pathname.split('/').pop();
      response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    }
    return Promise.resolve(response);
  }

  // handle streaming video. Without this the video loads but you can't seek or fast forward
  if (request.headers.has('range')) {
    const fullResp = await caches.match(request.url);
    if (fullResp) {
      return Promise.resolve(createPartialResponse(request, fullResp));
    }
  }

  const response = await caches.match(request);
  return Promise.resolve(response);
}

async function downloadVideos(course: Course, client: MessageEventSource) {
  console.log("Downloading Videos", course);
  const cache = await caches.open(`course-videos-${course.id}`);
  eachOfLimit(course.videos, 3, async(videoUrl) => {
    const response = await fetch(videoUrl);
    const videoBlob = await response.blob();
    const videoName = videoUrl.split('/').pop();
    await cache.put(`/courses/${course.id}/static_resources/${videoName}`, new Response(videoBlob, {headers: {'Content-Type': 'video/mp4'}}));
    // client.postMessage({type: "videoDownloaded", index});
    console.log("Downloaded Video", videoName);
  });
}
