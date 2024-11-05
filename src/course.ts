import overrideHomeButton from "./course/home_buttons";
import fixPdfDownloads from "./course/fix_pdf_downloads";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";

function init() {
  overrideHomeButton();
  fixPdfDownloads();
  renderPdfs();
  injectOfflineVideos();
}

init();
