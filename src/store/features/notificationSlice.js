// src/store/features/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotifications,
  createNotification,
  deleteNotification,
} from "../../API/notifications";

export const initialState = {
  list: [],
  status: "idle",
  error: null,
};
// === GET notifications ===
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (teamId, thunkAPI) => {
    try {
      return await getNotifications(teamId);
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd pobierania powiadomień");
    }
  }
);

// === CREATE notifications ===
export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (data, thunkAPI) => {
    try {
      return await createNotification(data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd tworzenia powiadomienia");
    }
  }
);

// === DELETE notifications ===
export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id, thunkAPI) => {
    try {
      await deleteNotification(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd usuwania powiadomienia");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === ADD ===
      .addCase(addNotification.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // === REMOVE ===
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (n) => n.NotificationID !== action.payload
        );
      });
  },
});

export default notificationSlice.reducer;
