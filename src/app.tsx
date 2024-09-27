import { createRoot } from "react-dom/client";
import getInitialCourseList from "./app/initial_course_list";
import React from "react";
import Root from './app/root';

async function init() {
  await activateWorker();
  const courses = await getInitialCourseList();
  createRoot(document.getElementById("react-app")!).render(<Root courses={courses}/>)
}

function activateWorker() {
  return new Promise<ServiceWorker>((resolve) => {
    navigator.serviceWorker.register("/worker.js");
    navigator.serviceWorker.ready.then(registration => {
      resolve(registration.active!);
    });
  });
}

function activateCourseButtons(worker) {
  const buttons = document.querySelectorAll(".course-download");
  buttons.forEach(button => {
    if (!(button instanceof HTMLButtonElement)) return;

    button.addEventListener("click", () => {
      worker.postMessage({ type: "downloadCourse", path: button.dataset.coursePath, courseId: button.dataset.courseId });
    });
  });
}

init();
