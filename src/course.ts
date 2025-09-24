// This is the script that is injected into the course page.
// It performs various DOM mutations add attaches listeners to
// fix or enhance the course experience.
import injectCourseMenuButton from "./course/inject_course_menu_button";
import changeCourseMenuText from "./course/change_course_menu_text";
import addManageVideosButton from "./course/add_manage_videos_button";
import overrideNavButtons from "./course/override_nav_buttons";
import fixFileDownloads from "./course/fix_file_downloads";
import autoExpandResourceList from "./course/auto_expand_resource_list";
import replaceResourceItems from "./course/replace_resource_items";
import fixTrailingSlashes from "./course/fix_trailing_slashes";
import renderPdfs from "./course/render_pdfs";
import injectOfflineVideos from "./course/inject_offline_videos";
import addUnloadListener from "./course/unload_listener";
import makeOutsideLinksOpenInNewTab from "./course/make_outside_links_open_in_new_tab";
import fixBadLinks from "./course/fix_bad_links";

function init() {
  addUnloadListener();
  injectCourseMenuButton();
  changeCourseMenuText();
  addManageVideosButton();
  overrideNavButtons();
  autoExpandResourceList();
  fixFileDownloads();
  injectOfflineVideos();
  replaceResourceItems();
  fixTrailingSlashes();
  renderPdfs();
  makeOutsideLinksOpenInNewTab();
  fixBadLinks();
}

addEventListener("DOMContentLoaded", init);
