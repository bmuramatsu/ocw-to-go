import React from "react";
import { ResourceItemData } from "../../types";
import ResourceItemLayout from "../resource_item_layout";
import { useAppSelector } from "../store/store";
import { useRoute } from "wouter";
import { selectVideoStatus } from "../store/video_selectors";
import { videoKeyFromPath } from "../utils/video_path_helper";

export default function ResourceItemPortal({
  name,
  navPath,
  downloadPath,
  fileType,
  size,
}: ResourceItemData) {
  const [, params] = useRoute("/courses/:courseId/*?");
  const courseId = params!.courseId;

  let videoKey: string | undefined;
  if (fileType.toUpperCase() === "VIDEO" && navPath) {
    videoKey = videoKeyFromPath(courseId, navPath);
  }

  const status = useAppSelector((s) => {
    if (!videoKey) return "ready";
    return selectVideoStatus(s, courseId, videoKey).status;
  });

  return (
    <>
      <link rel="stylesheet" href="/video-downloader-styles.css" />
      <ResourceItemLayout
        status={status}
        title={name}
        href={navPath}
        size={size}
        fileType={fileType}
        rightSide={
          downloadPath && (
            <a href={downloadPath} className="btn btn--primary">
              Download
            </a>
          )
        }
      />
    </>
  );
}
