import React from "react";
import { Checkmark, Download, Loader } from "./svgs";
import { DownloadStatus } from "./store/video_selectors";
import Anchor from "./course_portals/anchor";

interface ResourceItemLayoutProps {
  status: DownloadStatus;
  title: string;
  size?: string | null;
  href?: string | false | null;
  rightSide?: React.ReactNode;
  fileType: string;
}

// This is a generic layout component because we re-use this same layout in
// multiple places. It is used by course videos and other resource items, but
// inside and outside of course portals.
export default function ResourceItemLayout({
  status,
  title,
  size,
  href,
  rightSide,
  fileType,
}: ResourceItemLayoutProps) {
  return (
    <div className="video-list__item">
      <StatusIcon status={status} fileType={fileType} />
      <div className="video-list__item__content">
        <h3>{href ? <Anchor href={href}>{title}</Anchor> : title}</h3>
        {size && <p>{size}</p>}
      </div>
      {rightSide}
    </div>
  );
}

interface StatusIconProps {
  status: DownloadStatus;
  fileType: string;
}

function StatusIcon({ status, fileType }: StatusIconProps) {
  switch (status) {
    case "ready":
      return (
        <div className="video-list__graphic is-green">
          <div>{fileType}</div>
          <span>
            <Checkmark />
          </span>
        </div>
      );
    case "downloading":
    case "waiting":
      return (
        <div className="video-list__graphic is-loading">
          <div>{fileType}</div>
          <span>
            <Loader />
          </span>
        </div>
      );
    default:
      return (
        <div className="video-list__graphic is-red">
          <div>{fileType}</div>
          <span>
            <Download />
          </span>
        </div>
      );
  }
}
