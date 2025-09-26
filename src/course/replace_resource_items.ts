import ResourceItem from "../common/custom_elements/resource_item";
import type { ResourceItemData } from "../types";
import broadcastChannel from "./course_channel";
import nextId from "./portal_id_generator";
// Replaces the resource items with our own version that looks consistent with
// the OCW app, and clarifies the download language.
export default function replaceResourceItems() {
  const ids: string[] = [];

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

    const fileType = item
      .querySelector(".resource-type-thumbnail")
      ?.textContent?.trim();
    if (!fileType) return;

    const fileSize = item
      .querySelector(".resource-list-file-size")
      ?.textContent?.trim();

    const data: ResourceItemData = {
      name,
      navPath: navPath || null,
      downloadPath: downloadPath || null,
      fileType,
      size: fileSize || null,
    };
    const id = nextId();
    const customItem = new ResourceItem(id, data);

    item.replaceWith(customItem);

    ids.push(id);
  });

  broadcastChannel.postMessage({ type: "portals-opened", ids });
}
