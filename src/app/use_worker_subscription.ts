import React from 'react';
import { Course } from '../types';

export default function useWorkerSubscription(setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
  return React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      console.log("The Worker Sent a Message", event);
      if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
        // currently we don't have any events to listen to
      }
    }

    console.log("Subscribing to Worker Messages",navigator.serviceWorker);
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, [setCourses]);
}
