import React from "react";
import { Link } from "wouter";
import { CourseData } from "../../types";
import { useAppDispatch } from "../store/store";
import * as asyncActions from "../store/async_actions";

interface CourseCardMenuProps {
  courseData: CourseData;
}

export default function CourseCardMenu({ courseData }: CourseCardMenuProps) {
  const [expanded, setExpanded] = React.useState(false);

  const dispatch = useAppDispatch();

  const confirmRemove = React.useCallback(() => {
    if (
      window.confirm(
        "This will delete the course and all downloaded videos, are you sure you want to proceed?",
      )
    ) {
      dispatch(asyncActions.removeCourse(courseData.id));
    }
  }, [courseData.id, dispatch]);

  return (
    <>
      <button onClick={() => setExpanded((e) => !e)}>Menu</button>
      {expanded && (
        <ul className="course-card-menu">
          <li>
            <Link href={`/manage_videos/${courseData.id}`}>Manage Videos</Link>
          </li>
          <li>
            <button onClick={confirmRemove}>Remove Course</button>
          </li>
        </ul>
      )}
    </>
  );
}
