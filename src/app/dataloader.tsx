import useInitialCourses from "./dataloaders/use_initial_courses";
import useVideoStatus from "./dataloaders/use_video_status";

// This component is only present to trigger data-loading side effects based on state changes.
export default function DataLoader() {
  useInitialCourses();
  useVideoStatus();

  return null;
}
