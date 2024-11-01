import React from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import CourseList from "./course_list";
import CourseView from "./course_view";
import DataLoader from "./dataloader";
import VideoDownloaderContext from "./video_downloader_context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";

export default function Root() {
  return (
    <ReduxProvider store={store}>
      <DataLoader />
      <VideoDownloaderContext>
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/courses/:courseId">
              {({ courseId }) => <CourseView courseId={courseId} />}
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
