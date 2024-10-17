import React from 'react';
import CourseListItem from './course_list_item';
import { CourseStatus, CourseStatusMap, VideoStatusMap } from '../types';
import { ALL_COURSES } from './initial_course_list';

interface Props {
  courses: CourseStatusMap;
  videoStatus: VideoStatusMap;
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
  downloadCourseVideos: (course: CourseStatus) => void;
}

export default function CourseList({ courses, videoStatus, downloadCourse, removeCourse, downloadCourseVideos }: Props) {
  return (
    <div>
      {/* <DownloadTest /> */}
      {/* <VideoTest /> */}
      <h1><img src="/icons/android/android-launchericon-192-192.png" />Courses</h1>
      <ul>
        {ALL_COURSES.map(course => (
          <li key={course.id}>
            <CourseListItem
              courseStatus={courses[course.id]}
              videoStatus={videoStatus[course.id]}
              removeCourse={removeCourse}
              downloadCourse={() => downloadCourse(course.id, course.file)}
              downloadCourseVideos={() => downloadCourseVideos(courses[course.id])}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
