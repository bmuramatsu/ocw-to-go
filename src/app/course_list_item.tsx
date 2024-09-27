import React from 'react';
import { Course } from '../types';

interface Props {
  course: Course
  viewCourse: () => void
}

export default function CourseListItem({ course, viewCourse }: Props) {
  function beginDownload() {
    navigator.serviceWorker.ready.then(registration => {
      registration.active!.postMessage({ type: "downloadCourse", path: course.file, courseId: course.id });
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
    </>
  );
};
