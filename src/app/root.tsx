// Application root component. Loads dependencies and sets up routing.
import React from "react";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import DataLoader from "./dataloader";
import ScrollToTop from "./scroll_to_top";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { ServiceWorkerProvider } from "./service_worker_provider";
import { BroadcastProvider } from "./use_broadcast";
import { OnlineStatusProvider } from "./use_online_status";
import VideoModal from "./video_modal";
import AppRouter from "./router";

export default function Root() {
  return (
    <React.StrictMode>
      <ServiceWorkerProvider>
        <ReduxProvider store={store}>
          <DataLoader>
            <Router hook={useHashLocation}>
              <BroadcastProvider>
                <OnlineStatusProvider>
                  <ScrollToTop />
                  <VideoModal />
                  <AppRouter />
                </OnlineStatusProvider>
              </BroadcastProvider>
            </Router>
          </DataLoader>
        </ReduxProvider>
      </ServiceWorkerProvider>
    </React.StrictMode>
  );
}
