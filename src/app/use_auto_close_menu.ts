import React from "react";

// This wraps a typical boolean useState hook to automatically close the menu
// when the user clicks anywhere. Currently even clicking within the menu will
// close it. So far this is sufficient.
export default function useAutoCloseMenu(isOpen: boolean) {
  const [menuOpen, setMenuOpen] = React.useState(isOpen);

  const open = React.useCallback((e: React.MouseEvent) => {
    // stop propagation to avoid closing the menu immediately
    e.stopPropagation();
    setMenuOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  React.useEffect(() => {
    const onClick = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      window.addEventListener("click", onClick);
      return () => window.removeEventListener("click", onClick);
    }
  }, [menuOpen]);

  return [menuOpen, open, close] as const;
}
