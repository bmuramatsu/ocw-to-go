// This renders the course in an iframe. The course HTML and related assets
// are stored in the cache, and will be served by the service worker.
// We want the main window history to be used instead of the iframe,
// so that refreshing or sending links works properly. To accomplish this
// we stop navigation events within the iframe and instead navigate in
// the outer window. When that happens, a new iframe is created, that way
// there aren't duplicate history entries.
import React from "react";
import { useAppDispatch } from "./store/store";
import { useBroadcastChannel } from "./use_broadcast";
import { useLocation } from "wouter";
import { VideoData } from "../types";
import VideoDownloadPortal from "./video_portal";
import ErrorBoundary from "./error_boundary";
import { downloadVideo } from "./store/custom_actions";

interface Props {
  courseId: string;
  path: string | undefined;
}

export default function CourseView({ courseId, path }: Props) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  // this effect injects various items into the iframe to
  // enhance the course experience
  const [currentVideo, setCurrentVideo] = React.useState<VideoData | null>(
    null,
  );

  const dispatch = useAppDispatch();
  const [, navigate] = useLocation();
  const channel = useBroadcastChannel();

  React.useEffect(() => {
    const unsub = channel.subscribe((message) => {
      switch (message.type) {
        // this allows the iframed content to navigate with the router
        // rather than built-in browser navigation, which causes the page to reload
        // and interrupt tasks like video downloads
        case "navigate": {
          setCurrentVideo(null);
          navigate(message.href);
          break;
        }

        case "portal-opened": {
          setCurrentVideo(message.videoData);
          break;
        }

        case "download-video": {
          dispatch(
            downloadVideo({ videoId: message.videoData.youtubeKey, courseId }),
          );
          break;
        }
      }
    });

    return unsub;
  }, [channel, dispatch, navigate, courseId]);

  const parts = ["courses", courseId];
  if (path) {
    parts.push(path);
  }
  parts.push("index.html");
  const fullPath = `/${parts.join("/")}`;

  // Use a key so that the iframe is recreated when the path changes.
  // This prevents multiple history entries from being created.
  return (
    <React.Fragment key={fullPath}>
      <iframe
        src={fullPath}
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
        }}
        ref={ref}
      />
      {currentVideo && ref.current && (
        // Wrap in an error boundary because there's a potential for bugs if the
        // element is unmounted while the portal is open
        // The user shouldn't see this happen.
        <ErrorBoundary>
          <VideoDownloadPortal
            currentVideo={currentVideo}
            iframe={ref.current}
            courseId={courseId}
          />
        </ErrorBoundary>
      )}
    </React.Fragment>
  );
}
