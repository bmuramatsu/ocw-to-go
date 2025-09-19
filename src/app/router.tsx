// Application routes. Uses 'wouter' for routing.
import React from "react";
import { Route, Switch } from "wouter";
import Homepage from "./homepage";
import Accessibility from "./accessibility";
import CreativeCommons from "./creative_commons";
import TermsAndConditions from "./terms_and_conditions";
import CourseView from "./course_view";
import Layout from "./layout";
import ManageCourseVideos from "./manage_course_videos/manage_course_videos";
import CourseCatalog from "./course_catalog";
import AllCourses from "./all_courses";
import MyCourses from "./my_courses";

export default function Router() {
  return (
    <>
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
                {({ courseId }) => <ManageCourseVideos courseId={courseId} />}
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
    </>
  );
}
