export type {};
declare const self: ServiceWorkerGlobalScope;

console.log("The Worker Ran");

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/styles/pico.min.css',
  '/app.js',
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

// Disabled because this currently applies to all PDFs, but it does work
async function fileFromCache(request: Request): Promise<Response | undefined> {
  const response = await caches.match(request);
  if (response && request.url.endsWith('.pdf')) {
    response.headers.set('Content-Disposition', 'attachment; filename="test2.pdf"');
  }

  return Promise.resolve(response);
}
