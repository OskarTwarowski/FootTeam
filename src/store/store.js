import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/features/settingsSlice";
import activeProfileReducer from "../store/features/activeProfileSlice";
import profileReducers from "../store/features/profileSlice";
import registerReducers from "../store/features/RegisterSlice";
import trainingReducer from "../store/features/trainingSlice";
import authReducer from "../store/features/authSlice";
import teamReducer from "../store/features/teamSlice";
import notificationReducer from "../store/features/notificationSlice";

export const store = configureStore({
  reducer: {
    teams: teamReducer,
    settings: settingsReducer,
    activeProfile: activeProfileReducer,
    profiles: profileReducers,
    register: registerReducers,
    training: trainingReducer,
    auth: authReducer,
    notifications: notificationReducer,
  },
});
