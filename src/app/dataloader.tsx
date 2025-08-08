import React from "react";
import useInitialCourses from "./dataloaders/use_initial_courses";
import useInitialVideos from "./dataloaders/use_initial_videos";
import { useAppSelector } from "./store/store";

interface DataLoaderProps {
  children: React.ReactNode;
}

// This component is only present to trigger data-loading side effects based on state changes.
export default function DataLoader({ children }: DataLoaderProps) {
  useInitialCourses();
  useInitialVideos();

  const coursesInitialized = useAppSelector((s) => s.user.coursesInitialized);
  const videosInitialized = useAppSelector((s) => s.user.videosInitialized);

  if (!coursesInitialized || !videosInitialized) {
    return null;
  }

  return children;
}
