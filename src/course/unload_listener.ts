import { broadcastChannel } from "./course_channel";

// This captures all navigation within the iframe and sends it to the main window
// If navigation instead occurs using the back button, the main window will
// take care of that.
export default function addUnloadListener() {
  document.addEventListener("click", (e) => {
    // using composedPath to the original target even if it's inside a shadow DOM
    const target = e.composedPath()[0] as HTMLElement;

    const anchor = target.closest("a");
    // anchor.href returns the absolute URL, this gets the actual value in the dom,
    // which is more useful in this case
    const href = anchor?.getAttribute("href");

    // Capture events that are navigating within the course
    if (href?.startsWith(".") && href.endsWith("/index.html")) {
      e.preventDefault();

      let absolutePath = new URL(anchor!.href).pathname;
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
