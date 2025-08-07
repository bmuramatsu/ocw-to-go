import React from "react";
import { ALL_COURSES } from "./initial_course_list";
import { FeaturedCourseCard } from "./course_card/course_card";
import { CourseData } from "../types";
import { ChevronRight } from "./svgs";

export default function AllCourses() {
  const groupedCourses = React.useMemo(() => {
    const groups = ALL_COURSES.reduce(
      (acc, course) => {
        const category = course.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(course);
        return acc;
      },
      {} as Record<string, CourseData[]>,
    );

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.courseNumber.localeCompare(b.courseNumber));
    });

    return groups;
  }, []);

  const categories = React.useMemo(() => {
    return Object.keys(groupedCourses).sort();
  }, [groupedCourses]);

  return (
    <div className="accordion-container">
      {categories.map((category) => (
        <CategoryGroup
          key={category}
          category={category}
          courses={groupedCourses[category]}
        />
      ))}
    </div>
  );
}

interface CategoryGroupProps {
  category: string;
  courses: CourseData[];
}

function CategoryGroup({ category, courses }: CategoryGroupProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={open ? "accordion is-open" : "accordion"}>
      <button className="accordion-toggle" onClick={() => setOpen((o) => !o)}>
        <h2>{category} ({courses.length}){" "}</h2><ChevronRight />
      </button>
      <ul className="course-grid has-padding">
        {courses.map((course) => (
          <FeaturedCourseCard key={course.id} courseData={course} />
        ))}
        <li className="course-card--fake"></li> 
        <li className="course-card--fake"></li> 
      </ul>
    </div>
  );
}
