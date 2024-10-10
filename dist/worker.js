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
    "/course.js",
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
    const url = new URL(request.url);
    if (url && url.search.includes("forcedownload=true")) {
      url.search = "";
      const response2 = await caches.match(url);
      if (response2) {
        const fileName = url.pathname.split("/").pop();
        response2.headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
      }
      return Promise.resolve(response2);
    }
    const response = await caches.match(request);
    return Promise.resolve(response);
  }
})();
//# sourceMappingURL=worker.js.map
