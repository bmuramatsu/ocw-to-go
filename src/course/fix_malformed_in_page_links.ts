// In the zip files there are some in-page links that are malformed. They
// incorrectly have /index.html added to them. For example: #Introduction/index.html
// This removes the /index.html from such links.
export default function fixMalformedInPageLinks() {
  document
    .querySelectorAll<HTMLAnchorElement>("a[href^='#'][href$='/index.html']")
    .forEach((a) => {
      const href = a.getAttribute("href")!.replace("/index.html", "");
      a.setAttribute("href", href);
    });
}
