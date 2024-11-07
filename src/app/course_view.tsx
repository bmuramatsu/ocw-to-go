import React from "react";

interface Props {
  courseId: string;
}

export default function CourseView({ courseId }: Props) {
  const ref = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    function onLoad() {
      const childWindow = ref.current?.contentWindow;
      if (childWindow) {
        const pdfJsScript = childWindow.document.createElement("script");
        // Using an older version because newer versions require JS modules
        pdfJsScript.src =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
        pdfJsScript.id = "pdfjs";
        childWindow.document.body.appendChild(pdfJsScript);

        const envScript = childWindow.document.createElement("script");
        envScript.textContent = `window.PWA = {courseId: "${courseId}"};`;
        childWindow.document.body.appendChild(envScript);

        const script = childWindow.document.createElement("script");
        script.src = "/course.js";
        childWindow.document.body.appendChild(script);

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
  }, [ref, courseId]);

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
        src={`/courses/${courseId}/index.html`}
        style={{ width: "100%", height: "100vh", border: "none" }}
        ref={ref}
      />
    </>
  );
}
