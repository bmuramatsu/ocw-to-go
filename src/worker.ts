// This is the service worker script. It is primarily responsible for
// intercepting network requests and serving cached assets.
// It serves application assets, and unpacked course assets.

import { createPartialResponse } from "workbox-range-requests";
import ASSETS_TO_CACHE from "./worker/assets";
import { VERSION } from "./version";
import { ALL_COURSES, COURSES_BY_ID } from "./app/initial_course_list";

export type {};
declare const self: ServiceWorkerGlobalScope;
const ASSETS_CACHE = `pwa-assets-${VERSION}`;

// Version is primarily imported to force a worker update
// even if there are no code changes in the worker
// scripts. Otherwise users will not get the latest assets.
console.log("WORKER VERSION: " + VERSION);

async function cacheNewFiles() {
  const cache = await caches.open(ASSETS_CACHE);
  await cache.addAll(ASSETS_TO_CACHE);
}

// Load these separately. We don't want to block the worker installation. It's a
// large part of the install, and not strictly needed. Ideally we would also
// load these lazily as needed, but I'm keeping it simple for now.
async function cacheCourseCardImages() {
  const cache = await caches.open(ASSETS_CACHE);
  await cache.addAll(ALL_COURSES.map((course) => course.cardImg));
}

self.addEventListener("install", (event) => {
  console.log("The Worker Installed", event);

  event.waitUntil(cacheNewFiles());
  cacheCourseCardImages();
});

async function deleteOldCaches() {
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith("pwa-assets") && cacheName !== ASSETS_CACHE) {
      await caches.delete(cacheName);
    }
  }
}

self.addEventListener("activate", (event) => {
  console.log("The Worker Activated", event);

  event.waitUntil(deleteOldCaches());

  // Become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleFetch(event.request));
});

// We have multiple caches, one for the specific app version, and two for each
// downloaded course, one for the zip contents, and another for videos. This
// figured out where to serve from.
async function handleFetch(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Different origin, do not attempt to serve from cache
  if (url.origin !== self.location.origin) {
    return fetch(request);
  }

  // course asset
  const courseMatch = url.pathname.match(/^\/courses\/([^/]+)/);
  if (courseMatch) {
    return serveCourseFile(`course-${courseMatch[1]}`, request);
  }

  // course video
  const videoMatch = url.pathname.match(/^\/course-videos\/([^/]+)/);
  if (videoMatch) {
    return serveCourseFile(`course-videos-${videoMatch[1]}`, request);
  }

  // application asset, serve assets from this specific app version associated
  // with this worker
  return await serveAppAsset(request);
}

async function serveCourseFile(
  cacheName: string,
  request: Request,
): Promise<Response> {
  const cache = await caches.open(cacheName);
  if (!cache) {
    return missingResponse();
  }

  // handle special file downloads
  const url = new URL(request.url);
  if (url && url.search.includes("forcedownload=true")) {
    url.search = "";
    const response = await cache.match(url);
    if (response) {
      const fileName = url.pathname.split("/").pop();
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );
      return Promise.resolve(response);
    }
  }

  // handle streaming video. Without this the video loads but you can't seek or fast forward
  if (request.headers.has("range")) {
    const fullResp = await cache.match(request.url);
    // a 0 status indicates an opaque response. Range requests will not work with opaque responses.
    if (fullResp && fullResp.status !== 0) {
      return Promise.resolve(createPartialResponse(request, fullResp));
    }
  }

  // If this is an app html file, inject some JS and CSS
  const response = (await cache.match(request)) || missingResponse();

  if (response.status === 200) {
    const match = request.url.match(
      /\/courses\/([^/]+)\/(?:.*\/)?index\.html$/,
    );
    if (match) {
      const courseId = match[1];
      return injectOverrides(response, courseId);
    }
  }

  return Promise.resolve(response);
}

async function serveAppAsset(request: Request): Promise<Response> {
  const cache = await caches.open(ASSETS_CACHE);
  const resp = (await cache.match(request)) || missingResponse();

  // Don't allow the root app to be iframed or weird things happen
  const path = new URL(request.url).pathname;
  if (path === "/" || path === "/index.html") {
    const headers = new Headers(resp.headers);
    headers.set("X-Frame-Options", "DENY");
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  }

  return Promise.resolve(resp);
}

async function injectOverrides(
  response: Response,
  courseId: string,
): Promise<Response> {
  const course = COURSES_BY_ID[courseId];
  let text = await response.text();

  // inject stylesheet at the end of the head
  // note that this could be a problem if that string happens to appear earlier
  // in the document. So far this is not a problem.
  const stylesPath = WORKER_ASSET_MANIFEST["/course-styles.css"];
  text = text.replace(
    /<\/head>/i,
    `<link rel="stylesheet" href="${stylesPath}"></head>`,
  );

  // Inject scripts at the end of the body. This is less likely to fail because
  // this is almost guaranteed to be the last meaningful content in the file.
  const bodyEnd = text.lastIndexOf("</body>");
  text =
    text.slice(0, bodyEnd) +
    `<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js" id="pdfjs"></script>` +
    `<script>window.PWA = {course: ${JSON.stringify(course)}};</script>` +
    `<script src="${WORKER_ASSET_MANIFEST["/course.ts"]}"></script>` +
    text.slice(bodyEnd);

  // the length has changed, update the headers to match
  const headers = new Headers(response.headers);
  headers.append("content-length", text.length.toString());

  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function missingResponse() {
  return new Response("Not found", { status: 404 });
}
