// This is a course card, which displays metadata about the course,
// and status information about the state of the course download.
import React from "react";
import { CourseData } from "../../types";
import { Checkmark, ExternalLink } from "../svgs";
import CourseLink from "../course_link";
import { useAppSelector } from "../store/store";
import { selectUserCourse } from "../store/course_selectors";
import MainButton from "../course_card/main_button";
import CourseCardMenu from "../course_card/menu";
import VideoButton from "../course_card/video_button";

interface Props {
  courseData: CourseData;
  includeDescription?: boolean;
  includeManageVideos?: boolean;
}

function CourseCard({
  courseData,
  includeDescription = false,
  includeManageVideos = false,
}: Props) {
  const userCourse = useAppSelector((s) => selectUserCourse(s, courseData.id));

  const state = userCourse.status;

  return (
    <li className="course-card">
      {/* TODO real codes */}
      <div className="course-card__top">
        <div className="course-card__top-content">
          <div className="flex align-center gap-2">
            <span className="chip">18.06SC</span>
            {state === "ready" && (
              <span className="chip chip--downloaded">
                <Checkmark /> Downloaded
              </span>
            )}
          </div>
          <div id="top-right">
            {state === "ready" ? (
              <CourseCardMenu courseData={courseData} />
            ) : (
              <a
                href={`https://ocw.mit.edu/courses/${courseData.id}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary-white"
              >
                <ExternalLink />
                View online
              </a>
            )}
          </div>
        </div>
        <img
          loading="lazy"
          className="course-card__img"
          src={courseData.cardImg}
          alt={courseData.imgAltText}
        />
      </div>
      <div className="course-card__content">
        <h3>
          <CourseLink courseData={courseData}>{courseData.name}</CourseLink>
        </h3>
        <p>{courseData.instructors.join(", ")}</p>
        {includeDescription && <p className="u-mt-20">Description component here</p>}
      </div>
      <div className="course-card__actions">
        {includeManageVideos && state === "ready" && (
          <VideoButton courseData={courseData} />
        )}
        {userCourse.errorMessage && (
          <p className="error-message u-mb-4">{userCourse.errorMessage}</p>
        )}
        <MainButton courseData={courseData} userCourse={userCourse} />
      </div>
    </li>
  );
}

type CardFlavorProps = Omit<
  Props,
  "includeDescription" | "includeManageVideos"
>;

export function FeaturedCourseCard(props: CardFlavorProps) {
  return (
    <CourseCard {...props} includeDescription includeManageVideos={false} />
  );
}

export function MyCourseCard(props: CardFlavorProps) {
  return (
    <CourseCard {...props} includeDescription={false} includeManageVideos />
  );
}
