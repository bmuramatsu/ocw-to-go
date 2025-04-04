// Global app state is stored in redux. It can be accessed
// with types using the useApp* hooks below.
import {
  combineReducers,
  configureStore,
  MiddlewareAPI,
  Middleware,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import user from "./user_store";
import videoDownloadMiddleware from "./video_download_middleware";

// root reducer is declared separately so the type can be used when defining
// middleware
const rootReducer = combineReducers({ user });

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoDownloadMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// This is the type RTK expects
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AppMiddleware = Middleware<{}, RootState>;
export type AppMiddlewareAPI = MiddlewareAPI<AppDispatch, RootState>;
