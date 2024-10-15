import React from 'react';
import { Course } from '../types';

export default function useWorkerSubscription(setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
  return React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      console.log("The Worker Sent a Message", event);
      if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
        if (event.data.type === 'videoDownloaded') {
          setCourses(courses => courses.map(course => {
            if (course.id === event.data.courseId) {
              return { ...course, videosDownloaded: course.videosDownloaded + 1 };
            }
            return course;
          }));
        }
      }
    }

    console.log("Subscribing to Worker Messages",navigator.serviceWorker);
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, [setCourses]);
}
