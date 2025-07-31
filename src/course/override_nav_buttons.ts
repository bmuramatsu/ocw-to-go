import broadcastChannel from "./course_channel";

// Make various links within the courses take you back to the PWA
type Override = {
  selector: string;
  href: string;
};

const OVERRIDES: Override[] = [
  { selector: "a[href='https://ocw.mit.edu/']", href: "/" },
  {
    selector: "a[href='https://accessibility.mit.edu']",
    href: "/accessibility",
  },
  {
    selector: "a[href='https://creativecommons.org/licenses/by-nc-sa/4.0/']",
    href: "/creative_commons",
  },
  {
    selector: "a[href='https://ocw.mit.edu/pages/privacy-and-terms-of-use/']",
    href: "/terms_and_conditions",
  },
];

export default function overrideNavButtons() {
  OVERRIDES.forEach((o) => {
    document.querySelectorAll<HTMLAnchorElement>(o.selector).forEach((el) => {
      el.href = o.href;

      // this navigates with the app router instead of the browser history,
      // so the app doesn't reload
      el.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        broadcastChannel.postMessage({
          type: "navigate",
          href: o.href,
        });
      });
    });
  });
}
