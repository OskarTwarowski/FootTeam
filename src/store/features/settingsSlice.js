import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightMode: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleLightMode(state) {
      state.lightMode = !state.lightMode;
    },
  },
});

export const { toggleLightMode } = settingsSlice.actions;
export default settingsSlice.reducer;
