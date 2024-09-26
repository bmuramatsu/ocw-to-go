console.log("The Worker Ran");
importScripts("/scripts/jszip.min.js");

self.addEventListener('install', event => {
  console.log("The Worker Installed", event);
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
  console.log("The Worker Activated", event);
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

addEventListener('fetch', event => {
  console.log("The Worker Fetched", event);
  // if (isCacheable(event.request)) {
  event.respondWith(cacheFirstWithRefresh(event.request));
  // }
});

addEventListener('message', event => {
  console.log("The Worker Received a Message", event);
  if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
    if (event.data.type === 'downloadCourse') {
      downloadCourse(event.data.path, event.source);
    }
  }
  // event.source.postMessage("Hello from the worker!");
});

// function isCacheable(request) {
//   const url = new URL(request.url);
//   return !url.pathname.endsWith(".json");
// }

async function cacheFirstWithRefresh(request) {
  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open("AssetCacheV1");
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

async function downloadCourse(path, client) {
  console.log("The Worker is Downloading a Course", path);
  const resp = await fetch(path);
  console.log(resp);
  const zipBlob = await resp.blob();
  console.log(zipBlob);
  const zip = await new JSZip.loadAsync(zipBlob);
  console.log(zip);
  // can use "string" here. Not sure which we'll need yet
  const indexFile = await zip.file("index.html").async("string");
  console.log(indexFile);
  const cache = await caches.open("CourseCacheV1");
  // const keys = await cache.keys();
  const x = await cache.put('/courses/course-1/index.html', new Response(indexFile, { headers: { 'Content-Type': 'text/html' } }));
  console.log(x);
}
