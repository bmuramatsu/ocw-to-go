// This links you to the local view of a course.
import React from "react";
import { Link } from "wouter";
import { UserCourse } from "../types";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  userCourse: UserCourse;
}

export default function CourseLink({ userCourse, children, ...rest }: Props) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!userCourse.ready) {
      e.preventDefault();
    }
  }

  return (
    <Link href={`/courses/${userCourse.id}`} {...rest} onClick={onClick}>
      {children}
    </Link>
  );
}
