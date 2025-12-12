// src/store/features/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPlayerByUser,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../../API/players";

// === FETCH PROFILES (wiele!) ===
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, thunkAPI) => {
    const loggedUser = thunkAPI.getState().auth.user;
    if (!loggedUser) return [];

    try {
      const data = await getPlayerByUser(loggedUser.userId);

      if (Array.isArray(data)) return data;
      return data ? [data] : [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd pobierania profili");
    }
  }
);

// === ADD PROFILE ===
export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (newProfile, thunkAPI) => {
    try {
      const created = await createPlayer(newProfile);

      return created; // zwracamy OBIEKT, nie tablicę
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd tworzenia profilu");
    }
  }
);

// === UPDATE PROFILE ===
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

// === REMOVE PROFILE ===
export const removeProfile = createAsyncThunk(
  "profiles/removeProfile",
  async (id, thunkAPI) => {
    try {
      await deletePlayer(id);
      return id; // zwracamy ID do usunięcia
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
        state.list = action.payload; // ZAWSZE TABLICA
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* === ADD (DODAJEMY DO LISTY, NIE NADPISUJEMY) === */
      .addCase(addProfile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      /* === UPDATE === */
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex(
          (p) => p.playerID === updated.playerID
        );
        if (idx !== -1) state.list[idx] = updated;
      })

      /* === REMOVE (USUWAMY JEDEN PROFIL) === */
      .addCase(removeProfile.fulfilled, (state, action) => {
        const idToRemove = action.payload;
        state.list = state.list.filter((p) => p.playerID !== idToRemove);
      });
  },
});

export const { clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;
