import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/features/settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});
