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
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import Layout from "./layout";
import ManageCourseVideos from "./manage_course_videos/manage_course_videos";
import { BroadcastProvider } from "./use_broadcast";

export default function Root() {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <DataLoader />
        <Router hook={useHashLocation}>
          <BroadcastProvider>
            <ScrollToTop />
            <Switch>
              {/* Routes without layout */}
              <Route path="/courses/:courseId/*?">
                {({ courseId, "*": rest }) => (
                  <CourseView courseId={courseId} path={rest} />
                )}
              </Route>
              {/* Layout routes */}
              <Route>
                <Layout>
                  <Switch>
                    <Route path="/manage_videos/:courseId">
                      {({ courseId }) => (
                        <ManageCourseVideos courseId={courseId} />
                      )}
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
                    <Route>
                      <h1>Page not found.</h1>
                    </Route>
                  </Switch>
                </Layout>
              </Route>
            </Switch>
          </BroadcastProvider>
        </Router>
      </ReduxProvider>
    </React.StrictMode>
  );
}
