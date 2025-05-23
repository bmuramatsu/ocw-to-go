// This is the service worker script. It is primarily responsible for
// intercepting network requests and serving cached assets.
// It serves application assets, and unpacked course assets.

import { createPartialResponse } from "workbox-range-requests";
import ASSETS_TO_CACHE from "./worker/assets";
import { VERSION } from "./version";

export type {};
declare const self: ServiceWorkerGlobalScope;

// Version is primarily imported to force a worker updat
// even if there are no code changes in the worker
// scripts. Otherwise users will not get the latest assets.
console.log("WORKER VERSION:" + VERSION);

self.addEventListener("install", (event) => {
  console.log("The Worker Installed", event);
  event.waitUntil(
    (async () => {
      const cache = await caches.open("pwa-assets");
      await cache.addAll(ASSETS_TO_CACHE);
    })(),
  );
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("The Worker Activated", event);

  // Become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event: FetchEvent) => {
  // console.log("The Worker Fetched", event.request.url);
  event.respondWith(cacheFirst(event.request));
});

addEventListener("message", (event) => {
  console.log("The Worker Received a Message", event);
  if (
    typeof event.data === "object" &&
    !Array.isArray(event.data) &&
    event.data !== null
  ) {
    //if (event.data.type === "downloadVideos") {
    //  downloadVideos(event.data.course);
    //}
  }
});

async function cacheFirst(request: Request) {
  // return (await caches.match(request)) || await fetch(request);
  return (await fileFromCache(request)) || (await fetch(request));
}

async function fileFromCache(request: Request): Promise<Response | undefined> {
  // handle special file downloads
  const url = new URL(request.url);
  if (url && url.search.includes("forcedownload=true")) {
    url.search = "";
    const response = await caches.match(url);
    if (response) {
      const fileName = url.pathname.split("/").pop();
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );
    }
    return Promise.resolve(response);
  }

  // handle streaming video. Without this the video loads but you can't seek or fast forward
  if (request.headers.has("range")) {
    const fullResp = await caches.match(request.url);
    // a 0 status indicates an opaque response. Range requests will not work with opaque responses.
    if (fullResp && fullResp.status !== 0) {
      return Promise.resolve(createPartialResponse(request, fullResp));
    }
  }

  // handle logo replacement. Alternatively this could be done with the JS
  // injected into the page, but that causes it to pop in awkwardly.
  if (request.url.match(/ocw_logo_white\.[a-z0-9]*\.svg?/)) {
    const response = await caches.match("/images/to-go-logo.svg");
    return Promise.resolve(response);
  }

  const response = await caches.match(request);
  return Promise.resolve(response);
}

//async function postToClients(message: any) {
//  const clients = await self.clients.matchAll();
//  clients.forEach((client) => client.postMessage(message));
//}
