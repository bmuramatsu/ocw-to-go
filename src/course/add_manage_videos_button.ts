import env from "./env";

export default function addManageVideosButton() {
  const course = env.course;
  if (course.videos.length === 0) return;

  const container = document.querySelector(".course-image-section-container");
  if (!container) return;

  const link = document.createElement("a");
  link.className =
    "download-course-link-button btn btn-outline-primary btn-link link-button text-decoration-none px-4 py-2";
  link.textContent = "Manage Videos";

  link.href = `/#/manage_videos/${course.id}`;

  container.appendChild(link);
}
