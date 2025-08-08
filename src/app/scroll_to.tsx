import React from "react";

interface ScrollToProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  // href is not normally required
  href: string;
}

// Because the app uses hash routing, we have to scroll to IDs with JS
export default function ScrollTo(props: ScrollToProps) {
  const { href, children, ...rest } = props;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
