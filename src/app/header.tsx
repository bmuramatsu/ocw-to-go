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
    </header>
  );
}
