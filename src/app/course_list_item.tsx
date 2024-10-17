import React from 'react';
import { Link } from 'wouter';
import { CourseStatus, VideoStatus } from '../types';
import { COURSE_MAP } from './initial_course_list';

interface Props {
  courseStatus: CourseStatus
  downloadCourse: () => void
  removeCourse: (courseId: string) => void
  downloadCourseVideos: () => void
  videoStatus: VideoStatus | null;
}

export default function CourseListItem({ courseStatus, downloadCourse, removeCourse, downloadCourseVideos, videoStatus }: Props) {
  const course = COURSE_MAP[courseStatus.id];
  function beginDownload() {
    // navigator.serviceWorker.ready.then(registration => {
    //   registration.active!.postMessage({ type: "downloadCourse", path: course.file, courseId: course.id });
    // });
    downloadCourse();
  }

  function downloadVideos() {
    // navigator.serviceWorker.ready.then(registration => {
    //   registration.active!.postMessage({ type: "downloadVideos", course: course});
    // });
    downloadCourseVideos();
  }

  return (
    <>
      <p>
        {course.name}
      </p>
      <p>
        {!courseStatus.ready && courseStatus.status == "" && <button onClick={beginDownload}>Add Course</button>}
        {!courseStatus.ready && courseStatus.status != "" && `${courseStatus.status}`}
        {courseStatus.ready && (
          <>
            <Link href={`/courses/${course.id}`}>View Course</Link>
            <button onClick={() => removeCourse(course.id)}>Remove Course</button>
          </>
        )}
      </p>
      {videoStatus && !!videoStatus.total && (
        <p>
          {videoStatus.status === "unstarted" && <button onClick={downloadVideos}>Download Videos</button>}
          {videoStatus.finished}/{videoStatus.total} videos downloaded
        </p>
      )}
    </>
  );
};
