import React from "react";
import OcwBroadcastChannel, { OcwMessage } from "../common/broadcast_channel";
import { useAppDispatch } from "./store/store";
import * as customActions from "./store/custom_actions";

const channel = new OcwBroadcastChannel();

const BroadcastContext = React.createContext<OcwBroadcastChannel>(
  new OcwBroadcastChannel(),
);

interface Props {
  children: React.ReactNode;
}
export function BroadcastProvider({ children }: Props) {
  useMessageListener();
  return (
    <BroadcastContext.Provider value={channel}>
      {children}
    </BroadcastContext.Provider>
  );
}

function useMessageListener() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log("use effect");
    function onMessage(message: OcwMessage) {
      console.log("Received message from broadcast channel:", message);
      switch (message.type) {
        case "download-video": {
          dispatch(
            customActions.downloadVideo({
              courseId: message.courseId,
              videoId: message.videoId,
            }),
          );
        }
      }
    }

    channel.onMessage(onMessage);

    return () => channel.onMessage(() => {});
  }, [dispatch]);
}
