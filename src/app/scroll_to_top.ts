// By default, a SPA won't scroll up when you navigate between pages.
// This scrolls to the top any time the location changes.
import React from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [pathname] = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
