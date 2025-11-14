// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfiles,
  addProfile as addProfileService,
  updateProfile as updateProfileService,
  removeProfile as removeProfileService,
} from "../../services/ProfileService";

// pobieranie profili TYLKO dla zalogowanego użytkownika
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, thunkAPI) => {
    const loggedUser = thunkAPI.getState().auth.user;
    if (!loggedUser) return [];

    const profiles = getProfiles();
    return profiles.filter((p) => p.UserID === loggedUser.UserID);
  }
);

// pobieranie wszystkich profili (np. dla admina)
export const fetchAllProfiles = createAsyncThunk(
  "profiles/fetchAllProfiles",
  async () => {
    return getProfiles();
  }
);

// dodawanie profilu
export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (profile, thunkAPI) => {
    const loggedUser = thunkAPI.getState().auth.user;
    await addProfileService(profile);

    if (!loggedUser) return [];

    const profiles = getProfiles();
    return profiles.filter((p) => p.UserID === loggedUser.UserID);
  }
);

// aktualizacja profilu
export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async (profile) => {
    return await updateProfileService(profile);
  }
);

// usuwanie profilu
export const removeProfile = createAsyncThunk(
  "profiles/removeProfile",
  async (profile, thunkAPI) => {
    const loggedUser = thunkAPI.getState().auth.user;
    await removeProfileService(profile);

    if (!loggedUser) return [];

    const profiles = getProfiles();
    return profiles.filter((p) => p.UserID === loggedUser.UserID);
  }
);

//
// SLICE
//

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* --- FETCH PROFILES --- */
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* --- FETCH ALL --- */
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })

      /* --- ADD --- */
      .addCase(addProfile.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })

      /* --- UPDATE --- */
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        const index = state.list.findIndex(
          (p) => p.PlayerID === updated.PlayerID
        );

        if (index !== -1) state.list[index] = updated;
      })

      /* --- REMOVE --- */
      .addCase(removeProfile.fulfilled, (state, action) => {
        state.list = action.payload || [];
      });
  },
});

export default profileSlice.reducer;
