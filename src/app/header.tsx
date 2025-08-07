import React from "react";
import { Link } from "wouter";
import { Menu, Cancel } from "./svgs";
import { ALL_COURSES } from "./initial_course_list";

export default function Header() {
  const courseCount = React.useMemo(() => {
    return ALL_COURSES.length;
  }, []);

  return (
    <section className="bg--black">
      <div className="main__contain">
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
          <nav className="desktop-nav">
            <Link href="/all-courses" style={{ color: "white" }}>All Courses</Link>
            <Link href="/my-courses" style={{ color: "white" }}>My Courses</Link>
            {/* TODO where should this link go? */}
            <a href="https://ocw.mit.edu/about/" style={{ color: "white" }}>About OCW</a>
          </nav>
          <nav className="mobile-nav">
            <button className="icon-btn icon-btn--clear"><Menu /></button>
            <div className="mobile-nav__drawer">
              <div className="mobile-nav__drawer-top">
                <h2>Menu</h2>
                <button className="icon-btn icon-btn--clear is-black"><Cancel /></button>
              </div>
              <ul>
                <li><a href="" className="is-active">Home</a></li>
                <li><a href="">All courses ({courseCount})</a></li>
                <li><a href="">My courses</a></li>
                <li><a href="">About OCW</a></li>
              </ul>
              <p className="mobile-nav__drawer-bottom">Local Storage Used: <span>0.6% (98 MB / 64 GB)</span></p>
            </div>
          </nav>
        </header>
      </div>
    </section>
  );
}
