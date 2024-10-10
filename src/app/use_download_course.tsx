import React from 'react';
import JSZip from 'jszip';
import { Course } from '../types';

function mimeFromExtension(path: string) {
  const extension = path.split('.').pop();
  switch (extension) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'woff':
      return 'font/woff';
    case 'woff2':
      return 'font/woff2';
    case 'ttf':
      return 'font/ttf';
    case 'xml':
      return 'application/xml';
    case 'pdf':
      return 'application/pdf';
    case 'ico':
      return 'image/x-icon';
    case 'mp4':
      return 'video/mp4';
    default:
      console.log(`Unknown extension: ${extension}`);
      return 'text/plain';
  }
}

export default function useDownloadCourse(setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
  return React.useCallback(async (courseId: string, path: string) => {
  const updateCourseStatus = (status: string) => {
    setCourses(courses => courses.map(course => {
      if (course.id === courseId) {
        return { ...course, status: status, ready: status === 'Ready' };
      }
      return course;
    }))
  };

  try {
    updateCourseStatus('Downloading');
    const resp = await fetch(path);
    const zipBlob = await resp.blob();
    const zip = await new JSZip().loadAsync(zipBlob);
    updateCourseStatus('Saving');
    const cache = await caches.open(`course-${courseId}`);

    const paths: string[] = [];
    zip.forEach((path, fileData) => {
      if (!fileData.dir) {
        paths.push(path);
      }
    })

    for (const path of paths) {
      const mime = mimeFromExtension(path);
      const fileData = await zip.file(path)!.async("blob");
      await cache.put(`/courses/${courseId}/${path}`, new Response(fileData, { headers: { 'Content-Type': mime } }));
    }
    updateCourseStatus("Ready");
  } catch (e) {
    updateCourseStatus("Error: " + e.message);
  }

  }, []);
}
