// This renders the course in an iframe. The course HTML and related assets
// are stored in the cache, and will be served by the service worker
import React from "react";
import { COURSES_BY_ID } from "./initial_course_list";

interface Props {
  courseId: string;
}

export default function CourseView({ courseId }: Props) {
  const course = COURSES_BY_ID[courseId];
  const ref = React.useRef<HTMLIFrameElement>(null);

  // this effect injects various items into the iframe to
  // enhance the course experience
  React.useEffect(() => {
    function onLoad() {
      const childWindow = ref.current?.contentWindow;
      if (childWindow) {
        // Inject PDF.js into the iframe to render PDFs inline
        const pdfJsScript = childWindow.document.createElement("script");
        // Using an older version because newer versions require JS modules
        pdfJsScript.src =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
        pdfJsScript.id = "pdfjs";
        childWindow.document.body.appendChild(pdfJsScript);

        // Inject some configuration into the iframe
        const envScript = childWindow.document.createElement("script");
        envScript.textContent = `window.PWA = {course: ${JSON.stringify(course)}};`;
        childWindow.document.body.appendChild(envScript);

        // Inject the course script to adjust the DOM or listen to events
        const script = childWindow.document.createElement("script");
        script.src = "/course.js";
        childWindow.document.body.appendChild(script);

        // Inject some styles into the iframe to override built-in styles
        const link = childWindow.document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/course-styles.css";
        childWindow.document.head.appendChild(link);
      }
    }

    const iframe = ref.current;
    if (iframe) {
      iframe.addEventListener("load", onLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", onLoad);
      }
    };
  }, [ref, course]);

  // Listen to events from the iframe. Currently unused
  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== ref.current?.contentWindow) return;
      if (
        typeof e.data !== "object" ||
        Array.isArray(e.data) ||
        e.data === null
      )
        return;

      // We don't currently have any events to handle
    }

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [ref]);

  return (
    <>
      <iframe
        src={`/courses/${course.id}/index.html`}
        style={{ width: "100%", height: "100vh", border: "none" }}
        ref={ref}
      />
    </>
  );
}
