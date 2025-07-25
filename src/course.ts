// This is the script that is injected into the course page.
// It performs various DOM mutations add attaches listeners to
// fix or enhance the course experience.
import injectOnlineLink from "./course/inject_online_link";
import injectCourseMenuButton from "./course/inject_course_menu_button";
import changeCourseMenuText from "./course/change_course_menu_text";
import overrideNavButtons from "./course/override_nav_buttons";
import fixFileDownloads from "./course/fix_file_downloads";
import fixTrailingSlashes from "./course/fix_trailing_slashes";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";
import addUnloadListener from "./course/unload_listener";
import removeOfflineMessage from "./course/remove_offline_message";

function init() {
  addUnloadListener();
  injectOnlineLink();
  injectCourseMenuButton();
  changeCourseMenuText();
  overrideNavButtons();
  fixFileDownloads();
  fixTrailingSlashes();
  renderPdfs();
  injectOfflineVideos();
  removeOfflineMessage();
}

init();
