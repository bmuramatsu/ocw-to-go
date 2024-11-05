type ENV = {
  courseId: string;
};

// @ts-expect-error - This is injected by the parent window
const env = window.PWA as ENV;
export default env;
