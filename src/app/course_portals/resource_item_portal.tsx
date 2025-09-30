import React from "react";
import { ResourceItemData } from "../../types";
import ResourceItemLayout from "../resource_item_layout";
import { useAppSelector } from "../store/store";
import { selectVideoStatus } from "../store/video_selectors";
import { videoKeyFromPath } from "../utils/video_path_helper";

interface ResourceItemPortalProps {
  item: ResourceItemData;
  courseId: string;
}

// Replaces the built-in resource items with our own that
// disables extra download links and displays the download status
// properly
export default function ResourceItemPortal({
  item,
  courseId,
}: ResourceItemPortalProps) {
  const { name, navPath, downloadPath, fileType, size } = item;

  const isVideo = fileType.toUpperCase() === "VIDEO";

  let videoKey: string | undefined;
  if (isVideo && navPath) {
    videoKey = videoKeyFromPath(courseId, navPath);
  }

  const status = useAppSelector((s) => {
    if (isVideo) {
      if (videoKey) {
        return selectVideoStatus(s, courseId, videoKey).status;
      } else {
        return "none";
      }
    }
    return "ready";
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
            <a href={downloadPath} className="btn btn--primary-black-outlined">
              Download
            </a>
          )
        }
      />
    </>
  );
}
