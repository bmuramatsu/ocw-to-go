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
import ErrorBoundary from "./error_boundary";
import { downloadVideo } from "./store/custom_actions";
import CoursePortal from "./course_portals/course_portal";
import { IsInPortalProvider } from "./course_portals/use_is_in_portal";

interface Props {
  courseId: string;
  path: string | undefined;
}

export default function CourseView({ courseId, path }: Props) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  // this effect injects various items into the iframe to
  // enhance the course experience
  const [portals, setPortals] = React.useState<string[]>([]);

  const dispatch = useAppDispatch();
  const [location, navigate] = useLocation();
  const channel = useBroadcastChannel();

  React.useEffect(() => {
    setPortals([]);
  }, [location]);

  React.useEffect(() => {
    const unsub = channel.subscribe((message) => {
      switch (message.type) {
        // this allows the iframed content to navigate with the router
        // rather than built-in browser navigation, which causes the page to reload
        // and interrupt tasks like video downloads
        case "navigate": {
          navigate(message.href);
          break;
        }

        case "portals-opened": {
          setPortals((prev) => [...prev, ...message.ids]);
          break;
        }

        // I think this is unused...
        case "download-video": {
          dispatch(
            downloadVideo({ videoId: message.videoData.youtubeKey, courseId }),
          );
          break;
        }
      }
    });

    return unsub;
  }, [channel, dispatch, navigate, courseId, portals]);

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
      <IsInPortalProvider>
        {portals.map((id) => (
          <ErrorBoundary key={id}>
            <CoursePortal id={id} courseId={courseId} iframe={ref.current!} />
          </ErrorBoundary>
        ))}
      </IsInPortalProvider>
    </React.Fragment>
  );
}
