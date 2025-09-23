// Application root component. Loads dependencies and sets up routing.
import React from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Homepage from "./homepage";
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
import { OnlineStatusProvider } from "./use_online_status";
import CourseCatalog from "./course_catalog";
import AllCourses from "./all_courses";
import MyCourses from "./my_courses";
import Settings from "./settings";

export default function Root() {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <DataLoader>
          <Router hook={useHashLocation}>
            <BroadcastProvider>
              <OnlineStatusProvider>
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
                        <Route path="/all-courses">
                          <CourseCatalog>
                            <AllCourses />
                          </CourseCatalog>
                        </Route>
                        <Route path="/my-courses">
                          <CourseCatalog>
                            <MyCourses />
                          </CourseCatalog>
                        </Route>
                        <Route path="/settings">
                          <Settings />
                        </Route>
                        <Route path="/">
                          <Homepage />
                        </Route>
                        <Route>
                          <main>
                            <h1>Page not found.</h1>
                          </main>
                        </Route>
                      </Switch>
                    </Layout>
                  </Route>
                </Switch>
              </OnlineStatusProvider>
            </BroadcastProvider>
          </Router>
        </DataLoader>
      </ReduxProvider>
    </React.StrictMode>
  );
}
