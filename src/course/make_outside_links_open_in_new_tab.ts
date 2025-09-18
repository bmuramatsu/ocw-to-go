export default function makeOutsideLinksOpenInNewTab() {
  document.querySelectorAll("a").forEach((link) => {
    if (link.host !== window.location.host) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}
