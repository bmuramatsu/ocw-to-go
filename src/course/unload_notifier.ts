import OcwBroadcastChannel from "../common/broadcast_channel";

export default function addUnloadNotifier() {
  const channel = new OcwBroadcastChannel();

  // Adding 2 listeners because of stupid browser behavior
  // unload is deprecated and beforeunload is the new standard
  // BUT beforeunload has been broken in mobile Safari for years
  // For our use, it doesn't hurt to fire twice
  window.addEventListener("beforeunload", () => {
    channel.postMessage({ type: "page-unload" });
  });
  window.addEventListener("unload", () => {
    channel.postMessage({ type: "page-unload" });
  });
}
