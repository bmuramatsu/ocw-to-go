console.log("The Worker Ran");

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
  event.source.postMessage("Hello from the worker!");
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
