// This is the script that is injected into the course page.
// It performs various DOM mutations add attaches listeners to
// fix or enhance the course experience.
import injectOnlineLink from "./course/inject_online_link";
import overrideNavButtons from "./course/override_nav_buttons";
import fixFileDownloads from "./course/fix_file_downloads";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";
import addUnloadListener from "./course/unload_listener";

function init() {
  addUnloadListener();
  injectOnlineLink();
  overrideNavButtons();
  fixFileDownloads();
  renderPdfs();
  injectOfflineVideos();
}

init();
