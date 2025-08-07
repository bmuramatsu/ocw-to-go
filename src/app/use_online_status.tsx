// This tracks the internet connection status of the user. It can be used as a
// hook to get immediate updates
import React from "react";

const OnlineStatus = React.createContext(true);

export function useOnlineStatus() {
  return React.useContext(OnlineStatus);
}

interface OnlineStatusProviderProps {
  children: React.ReactNode;
}
export function OnlineStatusProvider({ children }: OnlineStatusProviderProps) {
  const [online, setOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const onlineListener = () => setOnline(true);
    const offlineListener = () => setOnline(false);
    window.addEventListener("online", onlineListener);
    window.addEventListener("offline", offlineListener);

    return () => {
      window.removeEventListener("online", onlineListener);
      window.removeEventListener("offline", offlineListener);
    };
  }, []);

  return (
    <OnlineStatus.Provider value={online}>{children}</OnlineStatus.Provider>
  );
}
