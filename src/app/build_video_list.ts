import { Video } from "../types";

type Manifest = { videos?: [{ file: string }] };

const VIDEO_HOST = "https://ocw.mit.edu";

export default async function buildVideoList(
  courseId: string,
): Promise<Video[]> {
  const videos: Video[] = [];

  const cache = await caches.open(`course-${courseId}`);
  const keys = await cache.keys();

  const manifestFiles = keys.filter((req) =>
    req.url.match(/video_galleries\/.*data.json$/),
  );
  console.log("manifestFiles", manifestFiles);

  for await (const req of manifestFiles) {
    const manifestFile = await cache.match(req);
    const manifest: Manifest = await manifestFile!.json();
    console.log("manifest", manifest);

    if (!manifest.videos) continue;
    for await (const videoData of manifest.videos) {
      const url = VIDEO_HOST + videoData.file;
      videos.push({ url, courseId });
    }
  }

  return videos;
}
