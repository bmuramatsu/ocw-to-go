import React from "react";
import { ALL_COURSES } from "./initial_course_list";
import { FeaturedCourseCard } from "./course_card/course_card";
import { CourseData } from "../types";

export default function AllCourses() {
  const groupedCourses = React.useMemo(() => {
    return ALL_COURSES.reduce(
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
  }, []);

  const categories = React.useMemo(() => {
    return Object.keys(groupedCourses).sort();
  }, [groupedCourses]);

  return (
    <>
      <h1>All Courses</h1>
      {categories.map((category) => (
        <CategoryGroup
          key={category}
          category={category}
          courses={groupedCourses[category]}
        />
      ))}
    </>
  );
}

interface CategoryGroupProps {
  category: string;
  courses: CourseData[];
}

function CategoryGroup({ category, courses }: CategoryGroupProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <h2>
        {category} ({courses.length}){" "}
        <button onClick={() => setOpen((o) => !o)}>Toggle</button>
      </h2>
      {open && (
        <div className="course-list">
          {courses.map((course) => (
            <FeaturedCourseCard key={course.id} courseData={course} />
          ))}
        </div>
      )}
    </div>
  );
}
