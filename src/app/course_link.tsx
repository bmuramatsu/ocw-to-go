// This links you to the local view of a course.
import React from "react";
import { Link } from "wouter";
import { useAppDispatch, useAppSelector } from "./store/store";
import { selectUserCourse } from "./store/course_selectors";
import downloadCourseAction from "./store/download_course_action";
import { CourseData } from "../types";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  courseData: CourseData;
}

export default function CourseLink({ courseData, children, ...rest }: Props) {
  const userCourse = useAppSelector((s) => selectUserCourse(s, courseData.id));
  const dispatch = useAppDispatch();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (userCourse.status !== "ready") {
      e.preventDefault();
    }
    if (userCourse.status === "none") {
      dispatch(downloadCourseAction(courseData));
    }
  }

  return (
    <Link href={`/courses/${courseData.id}`} {...rest} onClick={onClick}>
      {children}
    </Link>
  );
}
