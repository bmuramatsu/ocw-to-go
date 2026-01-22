export default function removeBrokenImages() {
  const images = document.querySelectorAll('img[src$="images/mp_logo.gif"]');
  images.forEach((img) => img.remove());
}
