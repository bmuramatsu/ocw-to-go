import React from "react";
import VideoDownloader from "./video_downloader";
import { useAppDispatch } from "./store/store";
import { updateVideoQueue, incrementCount } from "./store/user_store";
import { Video } from "../types";

interface Props {
  children: React.ReactNode;
}

// This initializes the VideoDownloader class and facilitates communication between the
// downloader and the rest of the app. The class is provided through react context so
// child components can call it's public methods.
// It's important that ALL of the hooks in this file are completely stable because they are
// passed into the VideoDownloader constructor
export default function LoadedVideoDownloaderContext({ children }: Props) {
  const dispatch = useAppDispatch();
  const setQueue = React.useCallback(
    (queue: Video[]) => {
      dispatch(updateVideoQueue(queue));
    },
    [dispatch],
  );

  const increment = React.useCallback(
    (courseId: string) => {
      dispatch(incrementCount(courseId));
    },
    [dispatch],
  );

  const [downloader] = React.useState<VideoDownloader>(
    () => new VideoDownloader(setQueue, increment),
  );

  return (
    <DownloaderContext.Provider value={downloader}>
      {children}
    </DownloaderContext.Provider>
  );
}

const defaultDownloader = new VideoDownloader(
  () => {},
  () => {},
);

const DownloaderContext =
  React.createContext<VideoDownloader>(defaultDownloader);
export const useDownloadVideos = () => React.useContext(DownloaderContext);
