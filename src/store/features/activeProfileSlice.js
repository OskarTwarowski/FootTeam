import { createSlice } from "@reduxjs/toolkit";

const activeProfileSlice = createSlice({
  name: "activeProfile",
  initialState: {
    profile: JSON.parse(localStorage.getItem("activeProfile")) || null,
  },
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
