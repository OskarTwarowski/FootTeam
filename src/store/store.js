import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import settingsReducer from "../store/features/settingsSlice";
import activeProfileReducer from "../store/features/activeProfileSlice";
import profileReducer from "../store/features/profileSlice";
import trainingReducer from "../store/features/trainingSlice";
import authReducer from "../store/features/authSlice";
import teamReducer from "../store/features/teamSlice";
import notificationReducer from "../store/features/notificationSlice";

const appReducer = combineReducers({
  teams: teamReducer,
  settings: settingsReducer,
  activeProfile: activeProfileReducer,
  profiles: profileReducer,
  training: trainingReducer,
  auth: authReducer,
  notifications: notificationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined; // reset redux
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "teams",
    "settings",
    "activeProfile",
    "training",
    "notifications",
  ],
  blacklist: ["profiles"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const logoutMiddleware = () => (next) => (action) => {
  if (action.type === "auth/logout") {
    localStorage.clear();
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logoutMiddleware),
});

export const persistor = persistStore(store);
