// when the user has no internet connection a message shows above videos
// indicating that you need to be online. Because we have offline videos
// the message isn't always accurate.
export default function removeOfflineMessage() {
  document.querySelectorAll(".show-offline").forEach((el) => {
    el.remove();
  });
}
