import React from 'react';
import { Link } from 'wouter';
import { Course, VideoStatus } from '../types';

interface Props {
  course: Course
  downloadCourse: () => void
  removeCourse: (courseId: string) => void
  downloadCourseVideos: () => void
  videoStatus: VideoStatus | null;
}

export default function CourseListItem({ course, downloadCourse, removeCourse, downloadCourseVideos, videoStatus }: Props) {
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
        {!course.ready && course.status == "" && <button onClick={beginDownload}>Add Course</button>}
        {!course.ready && course.status != "" && `${course.status}`}
        {course.ready && (
          <>
            <Link href={`/courses/${course.id}`}>View Course</Link>
            <button onClick={() => removeCourse(course.id)}>Remove Course</button>
          </>
        )}
      </p>
      {videoStatus && !!videoStatus.total && (
        <p>
          {videoStatus.status === "unstarted"
            ? <button onClick={downloadVideos}>Download Videos</button>
            : <>{videoStatus.finished}/{videoStatus.total} videos downloaded</>
          }
        </p>
      )}
    </>
  );
};
