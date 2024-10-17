import React from 'react';
import { Link } from 'wouter';
import { Course } from '../types';
import { Checkmark, Download, Loader, Trash } from './svgs';

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
      <a className="course-card__img" href="" aria-hidden tabIndex={-1}>
        <img loading="lazy" src="images/creole.jpg" alt="alt text" />
      </a>
      <div className="course-card__content">
        <p className="u-all-caps">6.100L | Undergraduate</p>
        <h3>
          <a href="">{course.name}</a>
        </h3>
        <p className="u-mt-12"><span>Instructor:</span> Dr. Ana Bell</p>
        <p className="u-mt-8"><span>Topics:</span> Engineering, Computer Science, Programming Languages</p>
      </div>
      <div className="course-card__actions">
        {!course.ready 
          ? (<button onClick={beginDownload} className="btn--has-icon">
              <Download />Course
            </button>)
          : (
            <Link href={`/courses/${course.id}`}>View Course</Link>
          )
        }
        {course.status && ` - ${course.status}`}
        {course.videos.length > 0 && (
          <button onClick={downloadVideos} className="btn--has-icon">
            <Download />{course.videos.length} Videos
          </button>
        )}
        <button className="btn--has-icon is-downloading" disabled>
            <Loader />{course.videosDownloaded}/{course.videos.length} Videos
          </button>
        <button className="btn--has-icon is-success" disabled>
            <Checkmark />{course.videos.length} Videos
          </button>
        <button onClick={downloadVideos} className="icon-btn">
          <Trash />
        </button>
      </div>
    </>
  );
};
