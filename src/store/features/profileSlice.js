// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfiles,
  addProfile as addProfileService,
  updateProfile as updateProfileService,
  removeProfile as removeProfileService,
} from "../../services/ProfileService";

// pobieranie profili z localStorage
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    const profiles = await getProfiles();
    return profiles;
  }
);

// dodawanie profilu
export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (profile) => {
    const added = await addProfileService(profile);
    return added;
  }
);
export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async (profile) => {
    const updated = await updateProfileService(profile);
    return updated;
  }
);
export const removeProfile = createAsyncThunk(
  "profiles/removeProfile",
  async (profile) => {
    await removeProfileService(profile);
    return profile;
  }
);
const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProfile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const index = state.list.findIndex(
          (p) => p.PlayerID === updated.PlayerID
        );
        if (index !== -1) {
          state.list[index] = updated;
        }
      })
      .addCase(removeProfile.fulfilled, (state, action) => {
        const removed = action.payload;
        state.list = state.list.filter((p) => p.PlayerID !== removed.PlayerID);
      });
  },
});

export default profileSlice.reducer;
