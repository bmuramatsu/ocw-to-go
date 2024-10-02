import React from 'react';
import { Course } from '../types';

interface Props {
  course: Course;
  goBack: () => void;
}

export default function CourseView({course, goBack}: Props) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('load', (e: Event) => {
        const childWindow = ref.current?.contentWindow;
        if (childWindow) {
          console.log('navigated', childWindow.location.href);
          childWindow.document.querySelectorAll("[href='https://ocw.mit.edu/']").forEach(el => {
            el.addEventListener('click', (e) => {
              e.preventDefault();
              goBack();
            });
          });
        }
      });
    }
  }, [ref]);

  return (
    <>
      {/* <button onClick={goBack}>Back</button> */}
      <iframe
        src={`/courses/${course.id}/index.html`}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        ref={ref}
      />
    </>
  );
}
