// This is the landing page
import React from "react";
import { Link } from "wouter";

export default function Homepage() {
  return (
    <main>
      <div>
        <h1>
          MIT courses for <span>offline</span> learning
        </h1>
        <p>
          Download MIT OpenCourseWare courses and materials. Perfect for limited
          internet access or data caps.
        </p>
        <Link href="/all-courses">Explore courses</Link>
        <Link href="/my-courses">My courses</Link>
      </div>
      <div>
        Browse.
        <br />
        Download.
        <br />
        Learn.
        <br />
        {/* TODO make this scroll down? use scrollIntoView */}
        <a>Learn More</a>
      </div>
      <div>
        <h2>Featured courses</h2>
        <h2>Cards go here</h2>
        <Link href="/all-courses">Explore all COUNT courses</Link>
      </div>
      <div id="how-to-use">
        <h2>How to use</h2>
        <h3>Browse Courses</h3>
        <p>
          Look through our catalog and choose a course you would like to start
          using.
        </p>
        <Link href="/all-courses">Browse courses</Link>
      </div>
    </main>
  );
}
