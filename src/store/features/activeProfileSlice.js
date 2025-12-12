// src/store/features/activeProfileSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  profile: null,
};
const activeProfileSlice = createSlice({
  name: "activeProfile",
  initialState,
  reducers: {
    setActiveProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem("activeProfile", JSON.stringify(action.payload));
    },
    clearActiveProfile: (state) => {
      state.profile = null;
      localStorage.removeItem("activeProfile");
    },
  },
});

export const { setActiveProfile, clearActiveProfile } =
  activeProfileSlice.actions;
export default activeProfileSlice.reducer;
