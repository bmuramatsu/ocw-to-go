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
      <a className="course-card__img" href="" aria-hidden tabIndex={-1}>
        <img loading="lazy" src="images/creole.jp" alt="alt text" />
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
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>Course
            </button>)
          : (
            <Link href={`/courses/${course.id}`}>View Course</Link>
          )
        }
        {course.status && ` - ${course.status}`}
        {course.videos.length > 0 && (
          <button onClick={downloadVideos} className="btn--has-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>{course.videos.length} Videos
          </button>
        )}
        <button className="btn--has-icon is-downloading" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"/></svg>{course.videosDownloaded}/{course.videos.length} Videos
          </button>
        <button className="btn--has-icon is-success" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>{course.videos.length} Videos
          </button>
        <button onClick={downloadVideos} className="icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
      </div>
    </>
  );
};
