import useInitialCourses from "./dataloaders/use_initial_courses";
import useVideoStatus from "./dataloaders/use_video_status";

export default function DataLoader() {
  useInitialCourses();
  useVideoStatus();

  return null;
}
