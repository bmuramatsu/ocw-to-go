// This is the script that is injected into the course page.
// It performs various DOM mutations add attaches listeners to
// fix or enhance the course experience.
import injectCourseMenuButton from "./course/inject_course_menu_button";
import changeCourseMenuText from "./course/change_course_menu_text";
import addManageVideosButton from "./course/add_manage_videos_button";
import overrideNavButtons from "./course/override_nav_buttons";
import fixFileDownloads from "./course/fix_file_downloads";
// import replaceResourceItems from "./course/replace_resource_items";
import autoExpandResourceList from "./course/auto_expand_resource_list";
import fixTrailingSlashes from "./course/fix_trailing_slashes";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";
import addUnloadListener from "./course/unload_listener";
import makeOutsideLinksOpenInNewTab from "./course/make_outside_links_open_in_new_tab";

function init() {
  addUnloadListener();
  injectCourseMenuButton();
  changeCourseMenuText();
  addManageVideosButton();
  overrideNavButtons();
  // replaceResourceItems();
  autoExpandResourceList();
  fixFileDownloads();
  fixTrailingSlashes();
  renderPdfs();
  injectOfflineVideos();
  makeOutsideLinksOpenInNewTab();
}

init();
