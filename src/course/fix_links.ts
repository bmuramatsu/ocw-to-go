// Fixes various link issues. Some links contain both types of issues and
// will be processed by both functions.

// There are some relative paths in the ZIP files that end with [path]/, rather
// than [path]/index.html. This appends 'index.html'. It won't fix links that
// end without a trailing slash, that would be more complicated to detect
// without false positives, and we haven't encountered that case yet.
export function fixTrailingSlashes() {
  const links = document.querySelectorAll("a[href^='.'][href$='/']");
  console.log(links, "links");

  links.forEach((link) => {
    const href = link.getAttribute("href")! + "index.html";
    link.setAttribute("href", href);
  });

  // These links end with a training slash, then a hash. like ./path/#section (or possibly ./path/#section.index.html, but that case is handled by fixMalformedInPageLinks)
  const hashLinks = document.querySelectorAll("a[href^='.'][href*='/#']")
  console.log(hashLinks, "hashlinks");

  hashLinks.forEach((link) => {
    debugger
    const href = link.getAttribute("href")!;
    const position = href.indexOf("/#")+1;
    const newHref = href.slice(0, position) + "index.html" + href.slice(position);
    link.setAttribute("href", newHref);
  });
}

// In the zip files there are some in-page links that are malformed. They
// incorrectly have /index.html added to them. For example: #Introduction/index.html
// This removes the /index.html from such links.
export function fixMalformedInPageLinks() {
  document
    .querySelectorAll<HTMLAnchorElement>("a[href*='#'][href$='/index.html']")
    .forEach((a) => {
      console.log(a, "malformed link");
      const href = a.getAttribute("href")!.replace(/\/index\.html$/, "");
      a.setAttribute("href", href);
    });
}
