import React from 'react';
import { Course } from '../types';

interface Props {
  course: Course;
  goBack: () => void;
}

export default function CourseView({course, goBack}: Props) {
  return (
    <>
      <button onClick={goBack}>Back</button>
      <iframe src={`/courses/${course.id}/index.html`} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </>
  );
}
