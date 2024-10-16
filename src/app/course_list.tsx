import React from 'react';
import CourseListItem from './course_list_item';
import { Course } from '../types';

interface Props {
  courses: Course[];
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
}

export default function CourseList({ courses, downloadCourse, removeCourse }: Props) {
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
              removeCourse={removeCourse}
              downloadCourse={() => downloadCourse(course.id, course.file)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
