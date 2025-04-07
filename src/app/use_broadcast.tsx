import React from "react";
import OcwBroadcastChannel, { OcwMessage } from "../common/broadcast_channel";
import { useAppDispatch, useAppStore } from "./store/store";
import * as customActions from "./store/custom_actions";
import { useLocation } from "wouter";
import { selectAllVideoStatus } from "./store/video_selectors";

// We don't really want this to be created more than once, so create once instance that will be accessed via context throughout the app
const channel = new OcwBroadcastChannel();

const BroadcastContext = React.createContext(channel);

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

// Messages that interact with react/redux should be handled here
function useMessageListener() {
  const store = useAppStore();
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

  // This might move down to the course view component as an optimization
  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      const videoStatus = selectAllVideoStatus(store.getState());
      channel.postMessage({
        type: "video-status",
        videoStatus,
      });
    });

    return unsub;
  }, [store]);
}
