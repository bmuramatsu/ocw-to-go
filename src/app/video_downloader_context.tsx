import React from "react";
import VideoDownloader from "./video_downloader";
import { useAppDispatch } from "./store/store";
import { updateVideoQueue, incrementCount } from "./store/user_store";
import { Video, VideoStatus } from "../types";

interface Props {
  children: React.ReactNode;
}

type DownloadCourse = (videoStatus: VideoStatus) => void;

// It's important that ALL of the hooks in this file are completely stable
export default function VideoDownloaderContext({ children }: Props) {
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

  const downloadCourse = React.useCallback(
    (videoStatus: VideoStatus) => {
      downloader.addCourseToQueue(videoStatus);
    },
    [downloader],
  );

  return (
    <DownloaderContext.Provider value={downloadCourse}>
      {children}
    </DownloaderContext.Provider>
  );
}

const DownloaderContext = React.createContext<DownloadCourse>(() => {});
export const useDownloadVideos = () => React.useContext(DownloaderContext);
