import { FullUserVideo } from "../app/store/video_selectors";
import { Download } from "./svgs";

export class DownloadVideo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          color: black;
        }
        #download-button, #in-progress, #finished {
          display: none;
        }
        #download-video[data-state="none"] #download-button {
          display: block;
        }
        #download-video[data-state="downloading"] #in-progress {
          display: block;
        }
        #download-video[data-state="in-waiting"] #in-progress {
          display: block;
        }
        #download-video[data-state="ready"] #finished {
          display: block;
        }
      </style>

      <div id="download-video" class="video-list__item" data-state="none">
        <div class="video-list__graphic">
          <div>VIDEO</div>
          <span>
            ${Download()}
          </span>
        </div>
        <div className="video-list__item__content">
          <h3>{video.title}</h3>
          <p>{bytes}</p>
        </div>

        <button id="download-button">Download Video</button>
        <span id="in-progress">Downloading...</span>
        <span id="finished">Finished</span>
      </div>
    `;

    this.downloadButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('download-video'));
    });
  }

  get downloadButton() {
    return this.shadowRoot!.getElementById('download-button')!
  }

  get container() {
    return this.shadowRoot!.getElementById('download-video')!;
  }

  updateStatus(video: FullUserVideo) {
    this.container.dataset.state = video.status;
  }
}

export function registerDownloadVideo() {
  if (!customElements.get('download-video')) {
    customElements.define('download-video', DownloadVideo);
  }
}
