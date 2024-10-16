import React from 'react';
import { Link } from 'wouter';
import { Course } from '../types';

interface Props {
  course: Course
  downloadCourse: () => void
}

export default function CourseListItem({ course, downloadCourse }: Props) {
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
      </p>
      <p>
        {!course.ready && course.status == "" && <button onClick={beginDownload}>Add Course</button>}
        {!course.ready && course.status != "" && `${course.status}`}
        {course.ready && <Link href={`/courses/${course.id}`}>View Course</Link>}
      </p>
      {course.videos.length > 0 && (
        <p>
          <button onClick={downloadVideos}>Download Videos</button>
          {course.videosDownloaded}/{course.videos.length} videos downloaded
        </p>
      )}
    </>
  );
};
