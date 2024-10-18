import React from 'react';
import { Link } from 'wouter';
import { Course, VideoStatus } from '../types';
import { Checkmark, Download, Loader, Trash } from './svgs';

interface Props {
  course: Course
  downloadCourse: () => void
  removeCourse: () => void
  downloadCourseVideos: () => void
  videoStatus: VideoStatus | null;
}

export default function CourseListItem({ course, downloadCourse, removeCourse, downloadCourseVideos, videoStatus }: Props) {
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
        {!course.ready && course.status == "" && (
          <button onClick={downloadCourse} className="btn--has-icon">
            <Download />Course
          </button>
        )}
        {!course.ready && course.status != "" && (
          <button className="btn--has-icon is-downloading" disabled>
            <Loader />Course
          </button>
        )}
        {course.ready && (<Link href={`/courses/${course.id}`}>View Course</Link>)}

        {videoStatus && !!videoStatus.total && (
          <>
            {videoStatus.status === "unstarted" && (
              <button onClick={downloadCourseVideos} className="btn--has-icon">
                <Download />{videoStatus.total} Videos
              </button>
            )}
            {videoStatus.status === "downloading" && (
              <button className="btn--has-icon is-downloading" disabled>
                <Loader />{videoStatus.finished}/{videoStatus.total} Videos
              </button>
            )}
            {videoStatus.status === "complete" && (
              <button className="btn--has-icon is-success" disabled>
                <Checkmark />{course.videos.length} Videos
              </button>
            )}
          </>
        )}
        <button onClick={removeCourse} className="icon-btn">
          <Trash />
        </button>
      </div>
    </>
  );
};
