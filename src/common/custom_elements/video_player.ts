import { VideoData } from "../../types";
import PortalTarget from "./portal_target";

interface VideoPlayerProps {
  video: VideoData;
}

export default class VideoPlayer extends PortalTarget<VideoPlayerProps> {
  get type() {
    return "video-player";
  }
}

customElements.define("video-player", VideoPlayer);
