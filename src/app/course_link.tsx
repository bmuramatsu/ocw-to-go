// This links you to the local view of a course.
import React from "react";
import { Link } from "wouter";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  courseId: string;
  ready: boolean;
}

export default function CourseLink({
  courseId,
  ready,
  children,
  ...rest
}: Props) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ready) {
      e.preventDefault();
    }
  }

  return (
    <Link href={`/courses/${courseId}`} {...rest} onClick={onClick}>
      {children}
    </Link>
  );
}
