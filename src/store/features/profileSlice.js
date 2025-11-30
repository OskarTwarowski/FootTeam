// src/store/features/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPlayerByUser,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../../API/players";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, thunkAPI) => {
    const loggedUser = thunkAPI.getState().auth.user;
    if (!loggedUser) return [];

    try {
      const data = await getPlayerByUser(loggedUser.userId);

      return data ? [data] : [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd pobierania profili");
    }
  }
);
export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (newProfile, thunkAPI) => {
    try {
      const created = await createPlayer(newProfile);

      return [created];
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd tworzenia profilu");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, data }, thunkAPI) => {
    try {
      const updated = await updatePlayer(id, data);
      return updated;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd aktualizacji profilu");
    }
  }
);

export const removeProfile = createAsyncThunk(
  "profiles/removeProfile",
  async (id, thunkAPI) => {
    try {
      await deletePlayer(id);
      return []; // brak profilu po usunięciu
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd usuwania profilu");
    }
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearProfiles(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* === FETCH === */
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* === ADD === */
      .addCase(addProfile.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      /* === UPDATE === */
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex(
          (p) => p.playerID === updated.playerID
        );
        if (idx !== -1) state.list[idx] = updated;
      })

      /* === REMOVE === */
      .addCase(removeProfile.fulfilled, (state, action) => {
        state.list = [];
      });
  },
});

export const { clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;
