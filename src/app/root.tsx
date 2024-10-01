import React from 'react';
import CourseListItem from './course_list_item';
import { Course } from '../types';
import CourseView from './course_view';

interface Props {
  courses: Course[];
}

export default function Root(props: Props) {
  const [courses, setCourses] = React.useState(props.courses);
  const [course, setCourse] = React.useState<Course | null>(null);

  React.useEffect(() => {
    console.log("adding event listener");

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
        if (event.data.type === 'statusUpdate') {
          setCourses(courses => courses.map(course => {
            if (course.id === event.data.courseId) {
              return { ...course, status: event.data.status, ready: event.data.status === 'Ready' };
            }
            return course;
          }))
        }
      }
    }
    navigator.serviceWorker.addEventListener("message", onMessage);

    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);

  if (course === null) {
    return (
      <div>
        <h1><img src="/icons/android/android-launchericon-192-192.png" />Courses</h1>
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <CourseListItem
                course={course}
                viewCourse={() => setCourse(course)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <CourseView course={course} goBack={() => setCourse(null)} />;
}
