import React from "react";
import { More } from "../svgs";
import { CourseData } from "../../types";
import { useAppDispatch } from "../store/store";
import * as asyncActions from "../store/async_actions";
import useAutoCloseMenu from "../use_auto_close_menu";

interface CourseCardMenuProps {
  courseData: CourseData;
}

export default function CourseCardMenu({ courseData }: CourseCardMenuProps) {
  const [expanded, open, close] = useAutoCloseMenu(false);

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
    <div className="menu-container">
      <button className="icon-btn" onClick={e => expanded ? close() : open(e)}><More /></button>
      {expanded && (
        <ul className="course-card-menu">
          <li>
            <a
              href={`https://ocw.mit.edu/courses/${courseData.id}`}
              target="_blank"
              rel="noreferrer"
            >
              View course online
            </a>
          </li>
          <li>
            <button onClick={confirmRemove}>Delete course and videos</button>
          </li>
        </ul>
      )}
    </div>
  );
}
