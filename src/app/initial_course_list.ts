import { Course } from "src/types";

const ALL_COURSES: Course[] = [
  {
    id: "course-1",
    name: "Genre Fiction Workshop: Fantasy",
    file: "/downloads/21w.758-fall-2016.zip",
    status: "",
    ready: false
  },
  {
    id: "course-2",
    name: "Creole Languages and Caribbean Identities",
    file: "/downloads/24.908-spring-2017-2.zip",
    status: "",
    ready: false
  },
  {
    id: "course-3",
    name: "Introduction to Computer Science and Programming in Python",
    file: "/downloads/6.0001-fall-2016.zip",
    status: "",
    ready: false
  },
  {
    id: "course-4",
    name: "Linear Algebra",
    file: "/downloads/18.06sc-fall-2011.zip",
    status: "",
    ready: false
  },
  {
    id: "course-5",
    name: "Kanji Learning Any Time, Any Place for Japanese VI",
    file: "/downloads/res.21g-506-spring-2021.zip",
    status: "",
    ready: false
  },
  {
    id: "course-6",
    name: "Kanji Learning Any Time, Any Place for Japanese V",
    file: "/downloads/res-21g-505-spring-2022.zip",
    status: "",
    ready: false
  }
]

export default async function getInitialCourseList(): Promise<Course[]> {
  const caches = await window.caches.keys();

  return ALL_COURSES.map((course) => {
    const ready = caches.includes(`course-${course.id}`);
    return {...course, ready};
  });
}
