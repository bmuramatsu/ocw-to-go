import overrideNavButtons from "./course/override_nav_buttons";
import fixPdfDownloads from "./course/fix_pdf_downloads";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";

function init() {
  overrideNavButtons();
  fixPdfDownloads();
  renderPdfs();
  injectOfflineVideos();
}

init();
