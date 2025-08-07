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

  const description = useDescriptionText(firstParagraph);

  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <p className="u-mt-20">
        <span
          dangerouslySetInnerHTML={{
            __html: expanded ? description.expandedText : description.text,
          }}
        />
        {description.isLong && !expanded && (
          <button onClick={() => setExpanded(true)}>View More</button>
        )}
      </p>
      {description.isLong && expanded && (
        <button onClick={() => setExpanded(false)}>View Less</button>
      )}
    </>
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

type DescriptionText = {
  isLong: boolean;
  text: string;
  expandedText: string;
};

// Using two values here to avoid truncating a small amount of text. For
// example, if the text is 405 characters, we don't want a button that is hiding
// 5 characters.
const COLLAPSE_CUTOFF = 500;
const COLLAPSED_SIZE = 400;

function useDescriptionText(
  firstParagraph: HTMLParagraphElement,
): DescriptionText {
  return React.useMemo((): DescriptionText => {
    if (firstParagraph.innerText.length <= COLLAPSE_CUTOFF) {
      return {
        isLong: false,
        text: firstParagraph.innerHTML,
        expandedText: "",
      };
    }

    return {
      isLong: true,
      // use text instead of HTML because truncating HTML can break tags
      text: firstParagraph.innerText.slice(0, COLLAPSED_SIZE) + "...",
      expandedText: firstParagraph.innerHTML,
    };
  }, [firstParagraph]);
}
