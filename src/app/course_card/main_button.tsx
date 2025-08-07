import React from "react";
import { CourseData, UserCourse } from "../../types";
import downloadCourseAction from "../store/download_course_action";
import { useAppDispatch } from "../store/store";
import { useFormattedBytes } from "../utils/format_bytes";
import { Play, Download, Loader } from "../svgs";
import CourseLink from "../course_link";

interface MainButtonProps {
  courseData: CourseData;
  userCourse: UserCourse;
}

export default function MainButton({
  courseData,
  userCourse,
}: MainButtonProps) {
  const dispatch = useAppDispatch();

  const unzippedCourseSize = useFormattedBytes(courseData.diskSize);
  const downloadProgress = Math.round(userCourse.downloadProgress * 100);
  const downloadCourse = () => dispatch(downloadCourseAction(courseData));

  switch (userCourse.status) {
    case "none":
      return (
        <button onClick={downloadCourse} className="btn btn--primary-black">
          <Download />
          Download ({unzippedCourseSize})
        </button>
      );
    case "downloading":
      return (
        <button className="btn btn--primary-black is-downloading" disabled>
          <Loader />
          Downloading ({downloadProgress}%)
        </button>
      );
    case "preparing":
      return (
        <button className="btn btn--primary-black is-downloading" disabled>
          <Loader />
          Preparing
        </button>
      );
    case "ready":
      return (
        <CourseLink courseData={courseData} className="btn btn--primary-black">
          <Play />
          View Course
        </CourseLink>
      );
  }
}
