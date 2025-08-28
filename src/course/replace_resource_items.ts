// Replaces the resources items with our own version that looks consistent with
// the OCW app, and clarifies the download language.
export default function replaceResourceItems() {
  document.querySelectorAll(".resource-item").forEach((item) => {
    const name = item
      .querySelector(".resource-list-item-details")
      ?.textContent?.trim();
    if (!name) return;

    const path = item.querySelector("a")?.getAttribute("href");
    if (!path) return;

    const type = item.querySelector(".resource-type-thumbnail")?.textContent;
    if (!path) return;

    const size = item
      .querySelector(".resource-list-file-size")
      ?.textContent?.trim();

    const template = document.createElement("template");
    template.innerHTML =
      "<div class='resource-item'>" +
      `<a href="${path}" class="resource-link">` +
      `<span class="resource-name">${name}</span> ` +
      `<span class="resource-type">${type}</span> ` +
      (size ? `<span class="resource-size">${size}</span>` : "") +
      "</a></div>";

    item.replaceWith(template.content.firstChild!);
  });
}
