import ResourceItem from "../common/custom_elements/resource_item";

// very basic type stubs for pdfjs
type PdfJs = {
  getDocument: (path: string) => { promise: Promise<PdfJsDoc> };
};

type PdfJsDoc = {
  numPages: number;
  getPage: (i: number) => Promise<PdfJsPage>;
};

type PdfJsViewport = {
  width: number;
  height: number;
};

type PdfJsPage = {
  getViewport: (options: { scale: number }) => PdfJsViewport;
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfJsViewport;
  }) => void;
};

// type stub for PDF library included in the zip files
declare global {
  interface Window {
    PDFObject: {
      supportsPDFs: boolean;
    };
  }
}

const pdfjs = (): PdfJs | null =>
  // @ts-expect-error - This is loaded from a CDN
  window.pdfjsLib;

export default async function renderPdfs() {
  await pdfJsIsLoaded();
  // If the browser supports PDFs natively, don't do anything
  if (window.PDFObject.supportsPDFs) {
    return false;
  }
  const wrapper = document.querySelector<HTMLElement>(".pdf-viewer");
  if (!wrapper) return;

  // This is the custom element that we inject
  const resourceItem = document.querySelector<ResourceItem>(
    "resource-item[data-download-path*='.pdf']",
  );
  if (!resourceItem) return;

  wrapper.classList.add("pdfjs-wrapper");

  wrapper.innerHTML = "";

  const path = resourceItem.dataset.downloadPath;
  if (!path) return;

  const doc = await pdfjs()!.getDocument(path).promise;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    renderPage(wrapper, page);
  }
}

function renderPage(wrapper: HTMLElement, page: PdfJsPage) {
  const canvas = document.createElement("canvas");
  canvas.style.maxWidth = "100%";
  canvas.style.height = "auto";
  wrapper.appendChild(canvas);
  const context = canvas.getContext("2d");

  const viewport = page.getViewport({ scale: 1.5 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  page.render({ canvasContext: context!, viewport });
}

function pdfJsIsLoaded(): Promise<true> {
  if (pdfjs()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.querySelector("script#pdfjs")!;
    script.addEventListener("load", () => {
      resolve(true);
    });
  });
}
