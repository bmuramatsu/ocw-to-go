// Make the home button go back to the PWA home page
export default function overrideHomeButton() {
  document.querySelectorAll("[href='https://ocw.mit.edu/']").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.parent.postMessage({ type: "goBack" });
    });
  });
}
