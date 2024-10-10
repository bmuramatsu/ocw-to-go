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

addEventListener('fetch', (event: FetchEvent) => {
  console.log("The Worker Fetched", event.request.url);
  event.respondWith(cacheFirst(event.request));
});

addEventListener('message', event => {
  console.log("The Worker Received a Message", event);
  // if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
  //   if (event.data.type === 'downloadCourse') {
  //     downloadCourse(event.data.path, event.data.courseId, event.source!);
  //   }
  // }
});

async function cacheFirst(request: Request) {
  // return (await caches.match(request)) || await fetch(request);
  return (await fileFromCache(request)) || await fetch(request);
}

async function fileFromCache(request: Request): Promise<Response | undefined> {
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

  const response = await caches.match(request);
  return Promise.resolve(response);
}
