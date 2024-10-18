import React from 'react';
import CourseListItem from './course_list_item';
import { Course, VideoStatusMap } from '../types';
import { Logo } from './svgs';

interface Props {
  courses: Course[];
  videoStatus: VideoStatusMap;
  downloadCourse: (courseId: string, path: string) => void;
  removeCourse: (courseId: string) => void;
  downloadCourseVideos: (course: Course) => void;
}

export default function CourseList({ courses, videoStatus, downloadCourse, removeCourse, downloadCourseVideos }: Props) {
  return (
    <div className="page-grid">
      {/* <DownloadTest /> */}
      {/* <VideoTest /> */}
      <div className="header-container">
        <header>
          <h1>
            <Logo />
          </h1>
        </header>
      </div>
      <main>
        <h2>Courses</h2>
        <ul className="course-grid">
          {courses.map(course => (
            <li key={course.id} className="course-card">
              <CourseListItem
                course={course}
                videoStatus={videoStatus[course.id]}
                removeCourse={() => removeCourse(course.id)}
                downloadCourse={() => downloadCourse(course.id, course.file)}
                downloadCourseVideos={() => downloadCourseVideos(course)}
              />
            </li>
          ))}
        </ul>
      </main>
      <div className="footer-container">
        <footer>
          <div className="flex gap-24 wrap space-between align-center">
            <img className="footer-logo" src="images/mit-logo-sm.svg" alt="mit open learning logo" />
            <ul className="inline-list gap-12">
              <li>
                <b><a href="https://accessibility.mit.edu">Accessibility</a></b>
              </li>
              <li>
                <b><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons License</a></b>
              </li>
              <li>
                <b><a href="https://ocw.mit.edu/pages/privacy-and-terms-of-use/">Terms and Conditions</a></b>
              </li>
            </ul>
          </div>
          <div className="flex gap-24 wrap space-between align-center u-mt-24">
            <p>MIT OpenCourseWare is an online publication of materials from over 2,500 MIT courses, freely sharing knowledge with learners and educators around the world. <a href="https://ocw.mit.edu/about/">Learn more</a></p>
            <p className="u-all-caps flex align-center">
              <b>proud member of:&nbsp;</b>
              <a href="https://www.oeglobal.org/" target="_blank">
                <img className="oeg-logo" src="images/oeglobal.png" alt="Open Education Global" />
              </a>
            </p>
          </div>
          <div className="flex gap-24 wrap space-between align-center u-mt-24">
            <p>© 2001-2024 Massachusetts Institute of Technology</p>
            <ul className="inline-list gap-24">
              <li>
                <a href="https://www.facebook.com/MITOCW" target="_blank">
                  <img className="footer-social-icon" src="images/facebook-icon.png" alt="facebook" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/mitocw" target="_blank">
                  <img className="footer-social-icon" src="images/instagram-icon.png" alt="instagram" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/MITOCW" target="_blank">
                  <img className="footer-social-icon" src="images/x-icon.png" alt="x (formerly twitter)" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/mitocw" target="_blank">
                  <img className="footer-social-icon" src="images/youtube-icon.png" alt="youtube" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/mit-opencourseware/" target="_blank">
                  <img className="footer-social-icon" src="images/linkedin-icon.png" alt="linkedin" />
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
