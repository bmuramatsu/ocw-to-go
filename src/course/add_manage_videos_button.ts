import env from "./env";

// Adds links to 'Course Videos' anywhere in the course where the 'Browse
// Resources' button appears
export default function addManageVideosButton() {
  if (env.course.videos.length === 0) return;

  addHomepageButton();
  addCourseDrawerButton();
  addMobileCourseDrawerButton();
}

// These are all very similar, but I'm keeping them separate to provide
// flexibility
function addHomepageButton() {
  const container = document.querySelector(".course-image-section-container");
  if (!container) return;

  const link = document.createElement("a");
  link.className =
    "download-course-link-button btn btn-outline-primary btn-link link-button text-decoration-none px-4 py-2";
  addLink(container, link);
}

function addCourseDrawerButton() {
  const container = document.querySelector("#desktop-course-drawer");
  if (!container) return;

  const link = document.createElement("a");
  link.className =
    "download-course-link-button btn btn-outline-primary btn-link link-button text-decoration-none px-4 py-2 ml-3";
  addLink(container, link);
}

function addMobileCourseDrawerButton() {
  const container = document.querySelector("#course-info-drawer");
  if (!container) return;

  const link = document.createElement("a");
  link.className =
    "download-course-link-button btn btn-outline-primary btn-link link-button text-decoration-none px-4 py-2 mb-3";
  addLink(container, link);
}

function addLink(container: Element, link: HTMLAnchorElement) {
  link.textContent = "Course Videos";

  const href = `/manage_videos/${env.course.id}`;
  link.href = href;

  container.appendChild(link);
}
