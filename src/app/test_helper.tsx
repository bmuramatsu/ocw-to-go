import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./store/store";
import { render as rawRender } from "@testing-library/react";

function setupStore(preloadedState: Partial<RootState> = {}) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

interface RenderOptions {
  storeData: Partial<RootState>;
}

export function render(
  children: React.ReactNode,
  { storeData }: RenderOptions = { storeData: {} },
) {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={setupStore(storeData)}>{children}</Provider>;
  }

  return rawRender(<TestWrapper>{children}</TestWrapper>);
}
