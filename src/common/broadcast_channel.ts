import { VideoData } from "../types";

const NAME = "ocw-broadcast-channel";

export type OcwMessage =
  | { type: "navigate"; href: string }
  | { type: "portal-opened"; videoData: VideoData }
  | { type: "video-player-state-change"; ready: boolean }
  | { type: "download-video"; videoData: VideoData };

type OnMessageCallback = (message: OcwMessage) => void;
type UnsubscribeCallback = () => void;

// This is a simple wrapper around the BroadcastChannel API that
// provides type-safe messages.
// It's used as an alternative to sending custom events back and
// forth between the iframe, the main window, and the worker.
// It should only be used for communication between those parts of the
// app, NOT for communication between react components.
export default class OcwBroadcastChannel {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(NAME);
  }

  postMessage(message: OcwMessage) {
    this.channel.postMessage(message);
  }

  // This is designed to be easy to use within react useEffect hooks.
  // The cleanup function in the hook should call the unsubscribe function
  // so you don't end up with multiple listeners.
  subscribe(callback: OnMessageCallback): UnsubscribeCallback {
    const listener = (event: MessageEvent<OcwMessage>) => {
      callback(event.data);
    };
    this.channel.addEventListener("message", listener);

    return () => {
      this.channel.removeEventListener("message", listener);
    };
  }
}
