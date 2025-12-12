import { configureStore, combineReducers } from "@reduxjs/toolkit";

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
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
