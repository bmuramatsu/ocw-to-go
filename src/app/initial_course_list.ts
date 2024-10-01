import { Course } from "src/types";

const ASSET_HOST = "https://mit-ocw-courses.atomicjoltdevapps.com";

const ALL_COURSES: Course[] = [
  {
    id: "course-10",
    name: "Introduction to CS and Programming using Python",
    file: ASSET_HOST+"/intro-to-cs-1.zip",
    status: "",
    ready: false
  },
  {
    id: "course-11",
    name: "Kanji Learning Any Time, Any Place for Japanese V",
    file: ASSET_HOST+"/japanese-v.zip",
    status: "",
    ready: false
  },
  {
    id: "course-12",
    name: "Kanji Learning Any Time, Any Place for Japanese VI",
    file: ASSET_HOST+"/japanese-vi.zip",
    status: "",
    ready: false
  },
  {
    id: "course-13",
    name: "Linear Algebra",
    file: ASSET_HOST+"/linear-algebra.zip",
    status: "",
    ready: false
  },
  {
    id: "course-14",
    name: "Introduction to Computer Science and Programming in Python",
    file: ASSET_HOST+"/intro-to-cs-2.zip",
    status: "",
    ready: false
  },
  {
    id: "course-15",
    name: "Creole Languages and Caribbean Identities",
    file: ASSET_HOST+"/creole.zip",
    status: "",
    ready: false
  },
]

export default async function getInitialCourseList(): Promise<Course[]> {
  const caches = await window.caches.keys();

  return ALL_COURSES.map((course) => {
    const ready = caches.includes(`course-${course.id}`);
    return {...course, ready};
  });
}
