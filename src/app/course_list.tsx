import React from 'react';
import CourseListItem from './course_list_item';
import { Course, VideoStatusMap } from '../types';

interface Props {
  courses: Course[];
  videoStatus: VideoStatusMap;
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
  downloadCourseVideos: (course: Course) => void;
}

export default function CourseList({ courses, videoStatus, downloadCourse, removeCourse, downloadCourseVideos }: Props) {
  return (
    <div>
      {/* <DownloadTest /> */}
      {/* <VideoTest /> */}
      <h1><img src="/icons/android/android-launchericon-192-192.png" />Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <CourseListItem
              course={course}
              videoStatus={videoStatus[course.id]}
              removeCourse={removeCourse}
              downloadCourse={() => downloadCourse(course.id, course.file)}
              downloadCourseVideos={() => downloadCourseVideos(course)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
