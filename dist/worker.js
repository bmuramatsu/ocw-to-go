"use strict";
(() => {
  // src/worker.ts
  console.log("The Worker Ran");
  var ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/favicon.ico",
    "/styles/pico.min.css",
    "/app.js",
    "/manifest.json",
    "/icons/android/android-launchericon-192-192.png",
    "/icons/android/android-launchericon-512-512.png"
  ];
  self.addEventListener("install", (event) => {
    console.log("The Worker Installed", event);
    event.waitUntil((async () => {
      const cache = await caches.open("pwa-assets");
      await cache.addAll(ASSETS_TO_CACHE);
    })());
    self.skipWaiting();
  });
  self.addEventListener("activate", (event) => {
    console.log("The Worker Activated", event);
    event.waitUntil(self.clients.claim());
  });
  addEventListener("fetch", (event) => {
    console.log("The Worker Fetched", event.request.url);
    event.respondWith(cacheFirst(event.request));
  });
  addEventListener("message", (event) => {
    console.log("The Worker Received a Message", event);
  });
  async function cacheFirst(request) {
    return await fileFromCache(request) || await fetch(request);
  }
  async function fileFromCache(request) {
    const response = await caches.match(request);
    if (response && request.url.endsWith(".pdf")) {
      response.headers.set("Content-Disposition", 'attachment; filename="test2.pdf"');
    }
    return Promise.resolve(response);
  }
})();
//# sourceMappingURL=worker.js.map
