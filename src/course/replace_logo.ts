export default function replaceLogo() {
  const logo = document.querySelector<HTMLImageElement>(".ocw-logo img")
  console.log("logo", logo);
  if (!logo) return;

  logo.src = "/images/to-go-logo.svg";
}
