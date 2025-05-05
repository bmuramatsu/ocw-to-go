// This is the script that is injected into the course page.
// It performs various DOM mutations add attaches listeners to
// fix or enhance the course experience.
import replaceLogo from "./course/replace_logo";
import overrideNavButtons from "./course/override_nav_buttons";
import fixFileDownloads from "./course/fix_file_downloads";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";

function init() {
  replaceLogo();
  overrideNavButtons();
  fixFileDownloads();
  renderPdfs();
  injectOfflineVideos();
}

init();
