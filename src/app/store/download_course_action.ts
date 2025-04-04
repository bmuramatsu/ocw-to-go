// Redux thunk that downloads a course, unzips it, and caches the files.
// This all happens asynchronously.
import JSZip from "jszip";
import { CourseData, UserCourse } from "../../types";
import { userActions } from "./user_store";
import { AppDispatch } from "./store";

export default function downloadCourseAction(courseData: CourseData) {
  return async function downloadCourseThunk(dispatch: AppDispatch) {
    const { id: courseId, file: path } = courseData;
    const update = (updates: Partial<UserCourse>) => {
      dispatch(userActions.updateCourse({ courseId, updates }));
    };

    try {
      update({ status: "downloading" });
      const resp = await fetch(path);
      const zipBlob = await resp.blob();
      const zip = await new JSZip().loadAsync(zipBlob);
      update({ status: "preparing" });
      const cache = await caches.open(`course-${courseId}`);

      const paths: string[] = [];
      zip.forEach((path, fileData) => {
        if (!fileData.dir) {
          paths.push(path);
        }
      });

      for (const path of paths) {
        const mime = mimeFromExtension(path);
        const fileData = await zip.file(path)!.async("blob");

        await cache.put(
          `/courses/${courseId}/${path}`,
          new Response(fileData, { headers: { "Content-Type": mime } }),
        );
      }

      update({ status: "ready" });
    } catch (e: unknown) {
      console.error("Error downloading course", e);
      update({ status: "error" });
    }
  };
}

// Files need to have a mime for the browser to serve them correctly.
// This list may not be exhaustive
function mimeFromExtension(path: string) {
  const extension = path.split(".").pop();
  switch (extension) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "xml":
      return "application/xml";
    case "pdf":
      return "application/pdf";
    case "ico":
      return "image/x-icon";
    case "mp4":
      return "video/mp4";
    case "vtt":
    case "webvtt":
      return "text/vtt";
    default:
      console.log(`Unknown extension: ${extension}`);
      return "text/plain";
  }
}
