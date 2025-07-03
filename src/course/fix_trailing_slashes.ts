// There are some relative paths in the ZIP files that end with [path]/, rather
// than [path]/index.html. This appends 'index.html'. It won't fix links that
// end without a trailing slash, that would be more complicated to detect
// without false positives, and we haven't encountered that case yet.
export default function fixTrailingSlashes() {
  const links = document.querySelectorAll("a[href^='.'][href$='/']");

  links.forEach((link) => {
    const href = link.getAttribute("href")! + "index.html";
    link.setAttribute("href", href);
  });
}
