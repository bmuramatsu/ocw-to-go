import { createRoot } from "react-dom/client";
import React from "react";
import Root from "./app/root";

async function init() {
  activateWorker();
  createRoot(document.getElementById("react-app")!).render(<Root />);
}

function activateWorker() {
  return new Promise<ServiceWorker>((resolve) => {
    navigator.serviceWorker.register("/worker.js");
    navigator.serviceWorker.ready.then((registration) => {
      resolve(registration.active!);
    });
  });
}

init();
