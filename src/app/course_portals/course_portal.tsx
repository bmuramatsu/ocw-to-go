import React from "react";
import { createPortal } from "react-dom";
import ResourceItemPortal from "./resource_item_portal";
import VideoDownloadPortal from "./video_portal";
import PortalTarget from "../../common/custom_elements/portal_target";
import ResourceItem from "../../common/custom_elements/resource_item";
import VideoPlayer from "../../common/custom_elements/video_player";

interface CoursePortalProps {
  id: string;
  iframe: HTMLIFrameElement;
  courseId: string;
}

// Renders portals inside the course. This is a generic wrapper
// that finds the portal target and renders the correct component
// inside
export default function CoursePortal({
  id,
  courseId,
  iframe,
}: CoursePortalProps) {
  const target = iframe.contentWindow?.document.getElementById(
    id,
  ) as PortalTarget<unknown> | null;

  if (!target) return null;

  switch (target.type) {
    case "resource-item": {
      const resourceItemTarget = target as ResourceItem;
      return createPortal(
        <ResourceItemPortal
          courseId={courseId}
          {...resourceItemTarget.props}
        />,
        target.shadowRoot!,
      );
    }
    case "video-player": {
      const videoPlayerTarget = target as VideoPlayer;
      return createPortal(
        <VideoDownloadPortal
          courseId={courseId}
          {...videoPlayerTarget.props}
        />,
        target.shadowRoot!,
      );
    }
    default: {
      return null;
    }
  }
}
