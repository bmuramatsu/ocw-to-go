import React from "react";

const IsInPortal = React.createContext(false);

interface IsInPortalProviderProps {
  children: React.ReactNode;
}

export function IsInPortalProvider({ children }: IsInPortalProviderProps) {
  return <IsInPortal.Provider value={true}>{children}</IsInPortal.Provider>;
}

export default function useIsInPortal() {
  return React.useContext(IsInPortal);
}
