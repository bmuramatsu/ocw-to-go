// On mobile devices, there's a course button menu that expands
// the table of contents. This replaces it with something more
// visually obvious.
export default function injectCourseMenuButton() {
  const button = document.querySelector<HTMLElement>(
    "#mobile-course-nav-toggle",
  );
  if (!button) return;

  const span = button.querySelector("span");
  if (span) {
    span.textContent = "View Course Menu";
  }
  button.querySelector("img")?.remove();

  button.prepend(makeImg());
}

function makeImg(): ChildNode {
  const template = document.createElement("template");
  template.innerHTML = htmlText;
  return template.content.firstChild!;
}

const htmlText = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e8eaed"><path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm200-80h360v-560H400v560Z"/></svg>`;
