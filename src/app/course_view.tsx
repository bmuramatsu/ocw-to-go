import React from 'react';
import { Course } from '../types';

interface Props {
  course: Course;
  goBack: () => void;
}

export default function CourseView({course, goBack}: Props) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    function onLoad(e: Event) {
      const childWindow = ref.current?.contentWindow;
      if (childWindow) {
        const script = childWindow.document.createElement('script');
        script.src = '/course.js';
        childWindow.document.body.appendChild(script);
      }
    }

    if (ref.current) {
      ref.current.addEventListener('load', onLoad);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('load', onLoad);
      }
    }
  }, [ref]);

  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      console.log('post message', e);
      if (e.source !== ref.current?.contentWindow) return;
      if (typeof e.data !== 'object' || Array.isArray(e.data) || e.data === null) return;

      if (e.data.type === 'goBack') {
        goBack();
      }
    }

    window.addEventListener('message', onMessage);

    () => window.removeEventListener('message', onMessage);
  });

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
