import useInitialCourses from "./dataloaders/use_initial_courses";
import useInitialVideos from "./dataloaders/use_initial_videos";

// This component is only present to trigger data-loading side effects based on state changes.
export default function DataLoader() {
  useInitialCourses();
  useInitialVideos();

  return null;
}
