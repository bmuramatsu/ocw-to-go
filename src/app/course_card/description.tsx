import React from "react";
import { CourseData } from "../../types";

interface CourseCardDescriptionProps {
  courseData: CourseData;
}

// Displays the first paragraph of the course description, and collapses it if
// it's too long.
export default function CourseCardDescription({
  courseData,
}: CourseCardDescriptionProps) {
  const firstParagraph = useFirstParagraph(courseData.descriptionHtml);

  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <p
      onClick={toggleExpanded}
      className={`course-card__description u-mt-20 ${expanded ? "is-open" : ""}`}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: firstParagraph.innerHTML,
        }}
      />
      <button onClick={toggleExpanded}>
        {expanded ? "View Less" : "View More"}
      </button>
    </p>
  );
}

// gets the first paragraph from the description HTML, or if there is no
// paragraph, returns the whole description wrapped in a paragraph
function useFirstParagraph(descriptionHtml: string): HTMLParagraphElement {
  return React.useMemo((): HTMLParagraphElement => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = descriptionHtml;

    let p = tempDiv.querySelector("p");
    if (p) return p;

    p = document.createElement("p");
    p.innerHTML = descriptionHtml;

    return p;
  }, [descriptionHtml]);
}
