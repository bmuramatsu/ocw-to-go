import React from "react";
import { Link } from "wouter";

interface Props {
  children: React.ReactNode;
}

export default function CourseCatalog({ children }: Props) {
  return (
    <main>
      <h2>Course Catalog</h2>
      <p>
        Explore COUNT MIT OpenCourseWare courses curated for offline learning
        from your mobile device.
      </p>
      <Link href="/my-courses" className={(active) => (active ? "active" : "")}>
        My courses (COUNT)
      </Link>
      <Link
        href="/all-courses"
        className={(active) => (active ? "active" : "")}
      >
        All courses (COUNT)
      </Link>
      {children}
    </main>
  );
}
