// Replace the text in the header of the mobile course menu.
// It's a little awkward to select because the heading contains text
// and DOM nodes
export default function changeCourseMenuText() {
  const heading = document.querySelector<HTMLElement>("#mobile-course-nav h3");
  if (!heading) return;

  const textNode = heading.firstChild;
  if (
    textNode &&
    textNode.nodeType === Node.TEXT_NODE &&
    // the text node contains newlines and spaces
    textNode.textContent?.trim() === "Browse Course Material"
  ) {
    textNode.textContent = "Course Menu";
  }
}
