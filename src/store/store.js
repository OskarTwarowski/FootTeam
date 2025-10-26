import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/features/settingsSlice";
import activeProfileReducer from "../store/features/activeProfileSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    activeProfile: activeProfileReducer,
  },
});
