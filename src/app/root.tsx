// Application root component. Loads dependencies and sets up routing.
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
import Layout from "./layout";

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
              <Layout>
                <Accessibility />
              </Layout>
            </Route>
            <Route path="/creative_commons">
              <Layout>
                <CreativeCommons />
              </Layout>
            </Route>
            <Route path="/terms_and_conditions">
              <Layout>
                <TermsAndConditions />
              </Layout>
            </Route>
            <Route path="/">
              <Layout>
                <CourseList />
              </Layout>
            </Route>
          </Switch>
        </Router>
      </VideoDownloaderContext>
    </ReduxProvider>
  );
}
