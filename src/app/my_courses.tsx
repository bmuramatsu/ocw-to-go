import React from "react";
import { MyCourseCard } from "./course_card/course_card";
import { useAppSelector } from "./store/store";
import { selectMyCourses } from "./store/course_selectors";

export default function MyCourses() {
  const myCourses = useAppSelector(selectMyCourses);
  // This way when you delete a course, or it errors out, the list doesn't
  // change. It will be recreated if you navigate away and back.
  const [stableCourses] = React.useState(myCourses);

  return (
    <>
      <ul className="course-grid has-padding">
        {stableCourses.map((course) => (
          <MyCourseCard key={course.id} courseData={course} />
        ))}
        <li className="course-card--fake"></li> 
        <li className="course-card--fake"></li> 
      </ul>
    </>
  );
}
