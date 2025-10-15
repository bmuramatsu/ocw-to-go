import { createRoot } from "react-dom/client";
import React from "react";
import Root from "./app/root";

async function init() {
  createRoot(document.getElementById("react-app")!).render(<Root />);
}

init();
