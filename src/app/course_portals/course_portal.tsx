import React from "react";
import ResourceItem from "../../common/custom_elements/resource_item";
import { createPortal } from "react-dom";
import ResourceItemPortal from "./resource_item_portal";

interface CoursePortalProps {
  id: string;
  iframe: HTMLIFrameElement;
}

export default function CoursePortal({ id, iframe }: CoursePortalProps) {
  const target = iframe.contentWindow?.document.getElementById(id);

  if (!target) return null;

  if (target.tagName === "RESOURCE-ITEM") {
    const item = target as ResourceItem;

    return createPortal(
      <ResourceItemPortal {...item.props} />,
      item.shadowRoot!,
    );
  }
}
