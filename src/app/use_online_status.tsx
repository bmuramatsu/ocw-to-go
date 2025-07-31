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
    const onlineListener = () => {
      console.log("on");
      setOnline(true);
    };
    const offlineListener = () => {
      console.log("off");
      setOnline(false);
    };

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
