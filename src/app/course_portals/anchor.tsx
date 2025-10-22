import React from "react";
import useIsInPortal from "./use_is_in_portal";
import { Link } from "wouter";

type AnchorProps = React.ComponentProps<"a"> & {
  // 'a' allows undefined 'href', we're not using that
  href: string;
};

// Depending on context, renders a normal anchor or wouter link. Within courses,
// we handle navigation using regular anchor tags
export default function Anchor(props: AnchorProps) {
  const isInPortal = useIsInPortal();

  if (isInPortal) {
    return <a {...props} />;
  }

  return <Link {...props} />;
}
