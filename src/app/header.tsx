import React from "react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header>
      <Link href="/">
        <img
          src="/images/to-go-logo.svg"
          alt="MIT OpenCourseWare To Go"
          height="38"
          width="217"
        />
      </Link>
      {/* TODO remove inline styles */}
      <Link href="/all-courses" style={{ color: "white" }}>All Courses</Link>
      <Link href="/my-courses" style={{ color: "white" }}>My Courses</Link>
      {/* TODO where should this link go? */}
      <a href="https://ocw.mit.edu/about/" style={{ color: "white" }}>About OCW</a>
    </header>
  );
}
