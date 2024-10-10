import React from 'react';
import CourseListItem from './course_list_item';
import { Course } from '../types';
import CourseView from './course_view';
import useDownloadCourse from './use_download_course';

interface Props {
  courses: Course[];
}

export default function Root(props: Props) {
  const [courses, setCourses] = React.useState(props.courses);
  const [course, setCourse] = React.useState<Course | null>(null);

  const downloadCourse = useDownloadCourse(setCourses);

  if (course === null) {
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
                viewCourse={() => setCourse(course)}
                downloadCourse={() => downloadCourse(course.id, course.file)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <CourseView course={course} goBack={() => setCourse(null)} />;
}
