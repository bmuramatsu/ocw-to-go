export default function hideLearningResourceTypes() {
  // There isn't a very good selector for this, so we have to look at the title
  const sections = document.querySelectorAll("section.course-detail-section");
  const section = Array.from(sections).find(
    (section) =>
      section.querySelector(".course-detail-title")?.textContent?.trim() ===
      "Learning Resource Types",
  );

  if (section) {
    section.remove();
  }
}
