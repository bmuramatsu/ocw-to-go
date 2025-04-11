import type { CourseVideoStatus } from "../app/store/video_selectors";
import { VideoData } from "../types";

const NAME = "ocw-broadcast-channel";

export type OcwMessage =
  | {
      type: "download-video";
      courseId: string;
      videoId: string;
    }
  | { type: "navigate"; href: string }
  | { type: "course-video-status"; videoStatus: CourseVideoStatus }
  | { type: "portalOpened"; videoData: VideoData }
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

  onMessage(callback: (message: OcwMessage) => void) {
    this.channel.onmessage = (event: MessageEvent<OcwMessage>) => {
      callback(event.data);
    };
  }

  clearOnMessage() {
    this.channel.onmessage = null;
  }

  // returns an unsubscribe function
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
