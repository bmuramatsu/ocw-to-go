// TODO I think this can be deleted
import { Video } from "../types";

type Manifest = { videos?: [{ file: string }] };

// Not using all of these yet but they could be useful in the future
type VideoData = {
  youtube_key: string;
  captions_file: string;
  transcript_file: string;
  thumbnail_file: string;
};

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
      let name = videoData.file.split("/").pop();
      if (!name) continue;
      name = name.replaceAll(".", "_");
      const videoDataFile = await cache.match(
        `/courses/${courseId}/resources/${name}/data.json`,
      );
      console.log(videoDataFile);
      if (!videoDataFile) continue;

      const videoJson: VideoData = await videoDataFile.json();

      videos.push({ url, courseId, youtubeKey: videoJson.youtube_key });
    }
  }

  return videos;
}
