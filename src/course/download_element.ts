import { FullUserVideo } from "../app/store/video_selectors";

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

      <div id="download-video" data-state="none">
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
