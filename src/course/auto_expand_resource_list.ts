// On the resource list pages, sometimes the first section is collapsed,
// we always want it expanded initially
export default function autoExpandResourceList() {
  const firstToggle = document.querySelector<HTMLAnchorElement>(
    ".resource-list-toggle a",
  );
  if (!firstToggle) return;

  // Check if it's collapsed by looking at the aria-expanded attribute
  const isExpanded = firstToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) return;

  firstToggle.click();
}
