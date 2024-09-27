"use strict";

async function init() {
  const worker = await activateWorker();

  navigator.serviceWorker.addEventListener("message", event => {
    console.log("The Main Thread Received a Message", event);
  });

  activateCourseButtons(worker)
}

function activateWorker() {
  return new Promise((resolve) => {
    navigator.serviceWorker.register("/worker.js");
    navigator.serviceWorker.ready.then(registration => {
      resolve(registration.active);
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
