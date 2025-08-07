import React from "react";
import { Link } from "wouter";
import { Menu, Cancel } from "./svgs";
import { ALL_COURSES } from "./initial_course_list";
import useAutoCloseMenu from "./use_auto_close_menu";
import StorageUsage from "./storage_usage";

export default function Header() {
  const courseCount = ALL_COURSES.length;

  const [navOpen, open, close] = useAutoCloseMenu(false);

  const activeClass = (isActive: boolean) => (isActive ? "is-active" : "");

  return (
    <section className="bg--black">
      <div className="main__contain sm-padding">
        <header>
          <Link href="/">
            <img
              src="/images/to-go-logo.svg"
              alt="MIT OpenCourseWare To Go"
              height="38"
              width="217"
            />
          </Link>
          <nav className="desktop-nav">
            <Link href="/all-courses">All Courses</Link>
            <Link href="/my-courses">My Courses</Link>
            <a href="https://ocw.mit.edu/about/">About OCW</a>
          </nav>
          <nav className="mobile-nav">
            <button className="icon-btn icon-btn--clear" onClick={open}>
              <Menu />
            </button>
            <div className={`mobile-nav__drawer ${navOpen ? "is-open" : ""}`}>
              <div className="mobile-nav__drawer-top">
                <h2>Menu</h2>
                <button
                  className="icon-btn icon-btn--clear is-black"
                  onClick={close}
                >
                  <Cancel />
                </button>
              </div>
              <ul>
                <li>
                  <Link href="/" className={activeClass}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/all-courses" className={activeClass}>
                    All courses ({courseCount})
                  </Link>
                </li>
                <li>
                  <Link href="/my-courses" className={activeClass}>
                    My courses
                  </Link>
                </li>
                <li>
                  <a href="https://ocw.mit.edu/about/">About OCW</a>
                </li>
              </ul>
              <p className="mobile-nav__drawer-bottom">
                <StorageUsage />
              </p>
            </div>
          </nav>
        </header>
      </div>
    </section>
  );
}
