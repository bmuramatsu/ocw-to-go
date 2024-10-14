import React from 'react';
import { Course } from '../types';

interface Props {
  course: Course
  viewCourse: () => void
  downloadCourse: () => void
}

export default function CourseListItem({ course, viewCourse, downloadCourse }: Props) {
  function beginDownload() {
    // navigator.serviceWorker.ready.then(registration => {
    //   registration.active!.postMessage({ type: "downloadCourse", path: course.file, courseId: course.id });
    // });
    downloadCourse();
  }

  function downloadVideos() {
    navigator.serviceWorker.ready.then(registration => {
      registration.active!.postMessage({ type: "downloadVideos", course: course});
    });
  }

  return (
    <>
      <p>
        {course.name}
        {course.status && ` - ${course.status}`}
      </p>
      {!course.ready 
        ? (<button onClick={beginDownload}>Add Course</button>)
        : (
          <button onClick={viewCourse}>View Course</button>
        )
      }
      {course.videos.length > 0 && (
        <button onClick={downloadVideos}>Download Videos</button>
      )}
    </>
  );
};
