import ENV from "./env";

export default function injectOnlineLink() {
  const title = document.querySelector("#course-banner h1");
  if (!title) return;

  const link = document.createElement("a");
  link.href = `https://ocw.mit.edu/courses/${ENV.course.id}`;
  link.target = "_blank";
  link.rel = "noreferrer";

  link.innerText = "View course online";

  title.appendChild(link);
}
