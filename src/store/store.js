import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/features/settingsSlice";
import activeProfileReducer from "../store/features/activeProfileSlice";
import profileReducers from "../store/features/profileSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    activeProfile: activeProfileReducer,
    profiles: profileReducers,
  },
});
