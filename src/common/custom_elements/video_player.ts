import { VideoData } from "../../types";
import PortalTarget from "./portal_target";

export interface VideoPlayerProps {
  video: VideoData;
  timeRange: [number, number] | null;
}

export default class VideoPlayer extends PortalTarget<VideoPlayerProps> {
  get type() {
    return "video-player";
  }
}

customElements.define("video-player", VideoPlayer);
