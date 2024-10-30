import React from "react";
import { Link } from "wouter";
import { Course } from "../types";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  course: Course;
}

// In the future, this may instead take you to the course in the regular OCW site
export default function CourseLink({ course, children, ...rest }: Props) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!course.ready) {
      e.preventDefault();
    }
  }

  return (
    <Link href={`/courses/${course.id}`} {...rest} onClick={onClick}>
      {children}
    </Link>
  );
}
