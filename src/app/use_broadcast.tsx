import React from "react";
import OcwBroadcastChannel, { OcwMessage } from "../common/broadcast_channel";
import { useAppDispatch } from "./store/store";
import * as customActions from "./store/custom_actions";
import { useLocation } from "wouter";

// We don't really want this to be created more than once, so create once instance that will be accessed via context throughout the app
const channel = new OcwBroadcastChannel();

const BroadcastContext = React.createContext(channel);

interface Props {
  children: React.ReactNode;
}
export function BroadcastProvider({ children }: Props) {
  //useMessageListener();

  return (
    <BroadcastContext.Provider value={channel}>
      {children}
    </BroadcastContext.Provider>
  );
}

export function useBroadcastChannel() {
  return React.useContext(BroadcastContext);
}

// Messages that interact with react/redux should be handled here
function useMessageListener() {
  const dispatch = useAppDispatch();
  const [_location, navigate] = useLocation();

  React.useEffect(() => {
    function onMessage(message: OcwMessage) {
      switch (message.type) {
        case "download-video": {
          dispatch(
            customActions.downloadVideo({
              courseId: message.courseId,
              videoId: message.videoId,
            }),
          );
          break;
        }
        // this allows the iframed content to navigate with the router
        // rather than built-in browser navigation, which causes the page to reload
        // and interrupt tasks like video downloads
        case "navigate": {
          navigate(message.href);
        }
      }
    }

    channel.onMessage(onMessage);

    return () => channel.clearOnMessage();
  }, [dispatch, navigate]);

}
