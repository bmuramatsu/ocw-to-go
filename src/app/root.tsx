import React from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import CourseList from "./course_list";
import Accessibility from "./accessibility";
import CreativeCommons from "./creative_commons";
import TermsAndConditions from "./terms_and_conditions";
import CourseView from "./course_view";
import DataLoader from "./dataloader";
import ScrollToTop from "./scroll_to_top";
import VideoDownloaderContext from "./video_downloader_context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";

export default function Root() {
  return (
    <ReduxProvider store={store}>
      <DataLoader />
      <VideoDownloaderContext>
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <Switch>
            <Route path="/courses/:courseId">
              {({ courseId }) => <CourseView courseId={courseId} />}
            </Route>
            <Route path="/accessibility">
              <Accessibility />
            </Route>
            <Route path="/creative_commons">
              <CreativeCommons />
            </Route>
            <Route path="/terms_and_conditions">
              <TermsAndConditions />
            </Route>
            <Route path="/">
              <CourseList />
            </Route>
          </Switch>
        </Router>
      </VideoDownloaderContext>
    </ReduxProvider>
  );
}
