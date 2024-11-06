import React from "react";

export default function CreativeCommons() {
  return (
    <div className="page-grid--text">
      <div className="header-container">
        <header>
          <img src="/images/to-go-logo.svg" alt="MIT OpenCourseWare To Go" />
        </header>
      </div>
      <main className="text-block">
        <h1>Creative Commons License</h1>
        <p>
          This work is licensed under the Creative Commons Attribution
          Noncommercial Sharealike 4.0 International License. To view a copy of
          the license, visit{" "}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            https://creativecommons.org/licenses/by-nc-sa/4.0/
          </a>
        </p>
      </main>
    </div>
  );
}
