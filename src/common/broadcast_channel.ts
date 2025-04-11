import { VideoData } from "../types";

const NAME = "ocw-broadcast-channel";

export type OcwMessage =
  | { type: "navigate"; href: string }
  | { type: "portal-opened"; videoData: VideoData }
  | { type: "video-player-state-change"; ready: boolean };

type OnMessageCallback = (message: OcwMessage) => void;
type UnsubscribeCallback = () => void;

export default class OcwBroadcastChannel {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(NAME);
  }

  postMessage(message: OcwMessage) {
    this.channel.postMessage(message);
  }

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
