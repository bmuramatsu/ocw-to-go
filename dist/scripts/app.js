"use strict";

function activateWorker() {
  return new Promise((resolve) => {
    navigator.serviceWorker.register("/worker.js");
    navigator.serviceWorker.ready.then(registration => {
      resolve(registration.active);
    });
  });

}

async function init() {
  const worker = await activateWorker();

  navigator.serviceWorker.addEventListener("message", event => {
    console.log("The Main Thread Received a Message", event);
  });

  worker.postMessage("Hello from the main thread");
}

init();
