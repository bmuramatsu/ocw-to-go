import React from "react";
import Footer from "./footer";

export default function Accessibility() {
  return (
    <div className="page-grid--text">
      <div className="header-container">
        <header>
          <img src="/images/to-go-logo.svg" alt="MIT OpenCourseWare To Go" />
        </header>
      </div>
      <main className="text-block">
        <h1>Our Commitment</h1>
        <p>
          MIT is committed to providing an environment that is accessible to
          individuals with disabilities. We invite all to learn about captioning
          and accessibility of digital content, and to report any accessibility
          issues or captioning requests in the form link on{" "}
          <a href="https://accessibility.mit.edu/">this page.</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
