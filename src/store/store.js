import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/features/settingsSlice";
import activeProfileReducer from "../store/features/activeProfileSlice";
import profileReducers from "../store/features/profileSlice";
import registerReducers from "../store/features/RegisterSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    activeProfile: activeProfileReducer,
    profiles: profileReducers,
    regiser: registerReducers,
  },
});
