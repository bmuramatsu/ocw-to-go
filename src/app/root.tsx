import React from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Course } from "../types";
import CourseList from "./course_list";
import CourseView from "./course_view";
import useDownloadCourse from "./use_download_course";
import useRemoveCourse from "./use_remove_course";
import useWorkerSubscription from "./use_worker_subscription";
import useVideoDownload from "./use_video_download";
import useVideoStatus from "./use_video_status";

interface Props {
  courses: Course[];
}

export default function Root(props: Props) {
  const [courses, setCourses] = React.useState(props.courses);

  const downloadCourse = useDownloadCourse(setCourses);
  useWorkerSubscription(setCourses);
  const [videoQueue, downloadCourseVideos] = useVideoDownload();
  const [videoStatus, rebuildStatus] = useVideoStatus(videoQueue);
  const removeCourse = useRemoveCourse(setCourses, rebuildStatus);

  const getCourse = (courseId: string) =>
    courses.find((course) => course.id === courseId)!;

  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/courses/:courseId">
          {({ courseId }) => <CourseView course={getCourse(courseId)} />}
        </Route>
        <Route path="/">
          <CourseList
            courses={courses}
            videoStatus={videoStatus}
            downloadCourse={downloadCourse}
            removeCourse={removeCourse}
            downloadCourseVideos={downloadCourseVideos}
          />
        </Route>
      </Switch>
    </Router>
  );
}
