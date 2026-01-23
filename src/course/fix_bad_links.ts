// replaces links to ocw staging environment
export default function fixBadLinks() {
  const badOrigin = "https://ocw-studio.odl.mit.edu";
  const goodOrigin = "https://ocw.mit.edu";

  document
    .querySelectorAll<HTMLAnchorElement>(`a[href^="${badOrigin}"]`)
    .forEach((a) => {
      console.log(`Fixing bad link: `, a);
      a.href = a.href.replace(badOrigin, goodOrigin);
    });
}
