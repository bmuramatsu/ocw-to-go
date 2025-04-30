import React from "react";
import OcwBroadcastChannel from "../common/broadcast_channel";

// We don't really want this to be created more than once, so create once instance that will be accessed via context throughout the app
const channel = new OcwBroadcastChannel();

const BroadcastContext = React.createContext(channel);

interface Props {
  children: React.ReactNode;
}
export function BroadcastProvider({ children }: Props) {
  return (
    <BroadcastContext.Provider value={channel}>
      {children}
    </BroadcastContext.Provider>
  );
}

export function useBroadcastChannel() {
  return React.useContext(BroadcastContext);
}
