// The parent window injects this state into the Iframe.
// This module is just a way to access the typed state.
type ENV = {
  courseId: string;
};

// @ts-expect-error - This is injected by the parent window
const env = window.PWA as ENV;
export default env;
