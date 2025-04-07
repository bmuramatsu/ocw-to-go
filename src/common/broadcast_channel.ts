import type { AllVideoStatus } from "../app/store/video_selectors";

const NAME = "ocw-broadcast-channel";

export type OcwMessage =
  | {
      type: "download-video";
      courseId: string;
      videoId: string;
    }
  | { type: "navigate"; href: string }
  | { type: "video-status"; videoStatus: AllVideoStatus };

export default class OcwBroadcastChannel {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(NAME);
  }

  postMessage(message: OcwMessage) {
    this.channel.postMessage(message);
  }

  onMessage(callback: (message: OcwMessage) => void) {
    this.channel.onmessage = (event: MessageEvent<OcwMessage>) => {
      callback(event.data);
    };
  }

  clearOnMessage() {
    this.channel.onmessage = null;
  }
}
