import React from "react";
import { CourseData } from "../../types";

interface CourseCardDescriptionProps {
  courseData: CourseData;
}

// renders the first paragraph of the course description, if there are no
// paragraphs, renders the whole description wrapped in a paragraph
export default function CourseCardDescription({
  courseData,
}: CourseCardDescriptionProps) {
  const firstParagraph = React.useMemo(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = courseData.descriptionHtml;

    const firstP = tempDiv.querySelector("p");
    if (firstP) return firstP.outerHTML;

    return `<p>${courseData.descriptionHtml}</p>`;
  }, [courseData.descriptionHtml]);

  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <div
        className="course-card__description"
        dangerouslySetInnerHTML={{ __html: firstParagraph }}
        style={
          expanded
            ? {}
            : { overflow: "hidden", lineHeight: "1.5em", maxHeight: "4.5em" }
        }
      />
      <button onClick={() => setExpanded((e) => !e)}>
        {expanded ? "Collapse" : "Expand"}
      </button>
    </>
  );
}
