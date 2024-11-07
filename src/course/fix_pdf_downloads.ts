// There are buttons to download PDFs in the course content, but they don't work in the PWA.
// Some have bad relative paths, so we fix those. We also add a query param that the service
// worker recognizes to force a download instead of opening the PDF in the browser, which doesn't
// work reliably in all browsers.
function overridePdfDownload() {
  const button = document.querySelector(
    ".download-button-container .button-wrapper .download-file",
  );
  if (!button) return;

  let href = button.getAttribute("href")!;
  if (href.startsWith("./static_resources")) {
    href = href.replace(/^\.\//, "../../");
  }

  href = href + "?forcedownload=true";
  button.setAttribute("href", href);
}

function overridePdfThumbnailDownload() {
  const buttons = document.querySelectorAll(
    ".resource-thumbnail[href$='.pdf']",
  );
  buttons.forEach((button) => {
    let href = button.getAttribute("href")!;
    if (href.startsWith("./static_resources")) {
      href = href.replace(/^\.\//, "../../");
    }
    href = href + "?forcedownload=true";
    button.setAttribute("href", href);
    button.removeAttribute("download");
  });
}

export default function fixPdfDownloads() {
  overridePdfDownload();
  overridePdfThumbnailDownload();
}
