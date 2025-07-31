import { broadcastChannel } from "./course_channel";

// This captures all navigation within the iframe and sends it to the main window
// If navigation instead occurs using the back button, the main window will
// take care of that.
export default function addUnloadListener() {
  document.addEventListener("click", (e) => {
    if (!e.target) return;

    const target = e.target as HTMLElement;
    const origin = target.closest("a");
    // origin.href returns the absolute URL, this gets the actual value in the dom,
    // which is more useful in this case
    const href = origin?.getAttribute("href");

    // Capture events that are navigating within the course
    if (href?.startsWith(".") && href.endsWith("/index.html")) {
      e.preventDefault();

      let absolutePath = new URL(origin!.href).pathname;
      absolutePath = absolutePath.replace("/index.html", "");
      broadcastChannel.postMessage({ type: "navigate", href: absolutePath });
      // capture events that are navigating to locations in the app
    } else if (href?.startsWith("/")) {
      e.preventDefault();
      broadcastChannel.postMessage({ type: "navigate", href });
    }
    // other links are ignored
  });
}
