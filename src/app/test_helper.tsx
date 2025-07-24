import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./store/store";
import { render as rawRender } from "@testing-library/react";
import { UserStore } from "./store/user_store";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";

export function initialUserStore(): UserStore {
  return {
    userCourses: {},
    userVideos: {},
    videoQueue: [],
    coursesInitialized: true,
    videosInitialized: true
  };
}

export function initialState(): RootState {
  return {
    user: initialUserStore(),
  };
}

interface InitialStoreData {
  user: Partial<UserStore>;
}
function setupStore(initialData: InitialStoreData) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { user: { ...initialUserStore(), ...initialData.user } },
  });
}

interface RenderOptions {
  userStore: Partial<UserStore>;
}

export function appRender(
  children: React.ReactNode,
  { userStore }: RenderOptions = { userStore: {} },
) {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const { hook } = memoryLocation({ path: "/" });
    return (
      <Router hook={hook}>
        <Provider store={setupStore({ user: userStore })}>{children}</Provider>
      </Router>
    );
  }

  return rawRender(<TestWrapper>{children}</TestWrapper>);
}
