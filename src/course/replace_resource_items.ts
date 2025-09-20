// Replaces the resource items with our own version that looks consistent with
// the OCW app, and clarifies the download language.
export default function replaceResourceItems() {
  document.querySelectorAll(".resource-item").forEach((item) => {
    const name = item
      .querySelector(".resource-list-item-details")
      ?.textContent?.trim();
    if (!name) return;

    const navPath = item
      .querySelector("a.resource-list-title")
      ?.getAttribute("href");

    const downloadPath = item
      .querySelector("a.download-file")
      ?.getAttribute("href");

    if (!navPath && !downloadPath) return;

    const fileType = item.querySelector(
      ".resource-type-thumbnail",
    )?.textContent;
    if (!fileType) return;

    const fileSize = item
      .querySelector(".resource-list-file-size")
      ?.textContent?.trim();

    const customItem = document.createElement("resource-item") as ResourceItem;
    customItem.dataset.name = name;
    if (navPath) customItem.dataset.navPath = navPath;
    if (downloadPath) customItem.dataset.downloadPath = downloadPath;
    customItem.dataset.fileType = fileType;
    if (fileSize) customItem.dataset.size = fileSize;

    item.replaceWith(customItem);
  });
}

const ResourceItemTemplate = document.createElement("template");
ResourceItemTemplate.innerHTML = `
  <link rel="stylesheet" href="/video-downloader-styles.css" />
  <div class="video-list__item">
    <div class="video-list__graphic is-green">
      <div id="file-type"></div>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" > <path d="M0 0h24v24H0V0z" fill="none" /> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
      </span>
    </div>
    <div class="video-list__item__content">
      <h3>
        <span id="title"></span>
        <a id="link-title"></a>
      </h3>
      <p id="size"></p>
    </div>
    <div class="video-actions flex flex-column align-end">
      <a id="download-link" class="btn btn--primary-black-outlined">
        Save
      </a>
    </div>
  </div>`;

// The custom element isn't doing anything special, but it encapsulates the template and shadow DOM logic. We're using a shadow DOM primarily to
// reuse the existing CSS from the video list items
// This is more complex than what we typically inject, but because it's
// static, we don't need to bring in React
class ResourceItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const name = this.dataset.name as string;
    const navPath = this.dataset.navPath;
    const downloadPath = this.dataset.downloadPath;
    const fileType = this.dataset.fileType as string;
    const size = this.dataset.size;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(ResourceItemTemplate.content.cloneNode(true));

    if (navPath) {
      const linkTitle = this._getChild("link-title");
      linkTitle.setAttribute("href", navPath);
      linkTitle.textContent = name;
      this._getChild("title").style.display = "none";
    } else {
      this._getChild("title").textContent = name;
      this._getChild("link-title").style.display = "none";
    }

    this._getChild("file-type").textContent = fileType;

    if (size) {
      this._getChild("size").textContent = size;
    }

    const downloadLink = this._getChild("download-link");
    if (downloadPath) {
      downloadLink.setAttribute("href", downloadPath);
    } else {
      downloadLink.style.display = "none";
    }
  }

  _getChild(id: string) {
    return this.shadowRoot!.getElementById(id)!;
  }
}

customElements.define("resource-item", ResourceItem);
