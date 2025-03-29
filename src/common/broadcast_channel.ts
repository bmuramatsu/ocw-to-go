const NAME = "ocw-broadcast-channel";

export type OcwMessage =
  | {
      type: "download-video";
      courseId: string;
      videoId: string;
    }
  | { type: "update-video-status" };

export default class OcwBroadcastChannel {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(NAME);
  }

  postMessage(message: OcwMessage) {
    this.channel.postMessage(message);
  }

  onMessage(callback: (message: OcwMessage) => void) {
    console.log("raw message");
    this.channel.onmessage = (event: MessageEvent<OcwMessage>) => {
      callback(event.data);
    };
  }

  //close() {
  //  console.log("Closing broadcast channel");
  //  this.channel.close();
  //}
}
