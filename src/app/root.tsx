import React from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { UserCourses } from "../types";
import CourseList from "./course_list";
import CourseView from "./course_view";
import useDownloadCourse from "./use_download_course";
import useRemoveCourse from "./use_remove_course";
import useWorkerSubscription from "./use_worker_subscription";
import useVideoDownload from "./use_video_download";
import useVideoStatus from "./use_video_status";

interface Props {
  courses: UserCourses;
}

export default function Root(props: Props) {
  const [userCourses, setUserCourses] = React.useState(props.courses);

  const downloadCourse = useDownloadCourse(setUserCourses);
  useWorkerSubscription(setUserCourses);
  const [videoQueue, downloadCourseVideos] = useVideoDownload();
  const [videoStatus, rebuildStatus] = useVideoStatus(videoQueue, userCourses);
  const removeCourse = useRemoveCourse(setUserCourses, rebuildStatus);

  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/courses/:courseId">
          {({ courseId }) => <CourseView courseId={courseId} />}
        </Route>
        <Route path="/">
          <CourseList
            userCourses={userCourses}
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
