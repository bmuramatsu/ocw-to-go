import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from "wouter/use-hash-location" 
import { CourseStatusMap } from '../types';
import CourseList from './course_list';
import CourseView from './course_view';
import useDownloadCourse from './use_download_course';
import useRemoveCourse from './use_remove_course';
import useWorkerSubscription from './use_worker_subscription';
import useVideoDownload from './use_video_download';
import useVideoStatus from './use_video_status';

interface Props {
  courses: CourseStatusMap
}

export default function Root(props: Props) {
  const [courses, setCourses] = React.useState(props.courses);

  const downloadCourse = useDownloadCourse(setCourses);
  const removeCourse = useRemoveCourse(setCourses);
  useWorkerSubscription(setCourses);
  const [queue, downloadCourseVideos] = useVideoDownload();
  const videoStatus = useVideoStatus(queue, courses);
  console.log(videoStatus);
  

  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/courses/:courseId">{({courseId}) => <CourseView courseId={courseId}/>}</Route>
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
  // return <CourseView course={course} goBack={() => setCourse(null)} />;
}
