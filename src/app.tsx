import { createRoot } from "react-dom/client";
import React from "react";
import Root from "./app/root";

function init() {
  activateWorker();
  createRoot(document.getElementById("react-app")!).render(<Root />);
}

function activateWorker() {
  // start activating the worker but don't wait for it
  navigator.serviceWorker.register("/worker.js");
}

init();
