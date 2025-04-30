// There are buttons to download PDFs in the course content, but they don't work in the PWA.
// Some have bad relative paths, so we fix those. We also add a query param that the service
// worker recognizes to force a download instead of opening the PDF in the browser, which doesn't
// work reliably in all browsers.
export default function fixFileDownloads() {
  const buttons = document.querySelectorAll("a[href^='./static_resources']");

  buttons.forEach((button) => {
    let href = button.getAttribute("href")!;
    href = href.replace(/^\.\//, "../../");
    href = href + "?forcedownload=true";
    button.setAttribute("href", href);
    button.removeAttribute("download");
    button.removeAttribute("target");
  });
}
