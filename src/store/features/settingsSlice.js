import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightMode: false,
  fontSize: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleLightMode(state) {
      state.lightMode = !state.lightMode;
    },
    setFontSize(state) {
      state.fontSize = !state.fontSize;
    },
  },
});

export const { toggleLightMode, setFontSize } = settingsSlice.actions;
export default settingsSlice.reducer;
