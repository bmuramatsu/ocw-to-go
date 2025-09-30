// corrects some known bad links in the course content
const links = [
  {
    from: "https://ocw-studio.odl.mit.edu/terms/#cc",
    to: "https://ocwtogo.mit.edu/#/terms_and_conditions",
  },
  {
    from: "https://ocw-studio.odl.mit.edu/courses/ocw-scholar/",
    to: "https://ocw.mit.edu/courses/ocw-scholar/",
  },
];

export default function fixBadLinks() {
  links.forEach(({ from, to }) => {
    document
      .querySelectorAll<HTMLAnchorElement>(`a[href="${from}"]`)
      .forEach((a) => {
        a.href = to;
      });
  });
}
