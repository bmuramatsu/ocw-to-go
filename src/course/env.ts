// The parent window injects this state into the Iframe.
import { CourseData } from "../types";

// This module is just a way to access the typed state.
type ENV = {
  course: CourseData;
};

// @ts-expect-error - This is injected by the parent window
const env = window.PWA as ENV;
export default env;
