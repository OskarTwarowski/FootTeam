import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API/axios";

// === GET ALL trainings ===
export const fetchTrainings = createAsyncThunk(
  "trainings/fetchTrainings",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/trainings");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd pobierania treningów");
    }
  }
);

// === CREATE training ===
export const createTraining = createAsyncThunk(
  "trainings/createTraining",
  async (trainingData, thunkAPI) => {
    try {
      const res = await API.post("/trainings", trainingData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd tworzenia treningu");
    }
  }
);

// === UPDATE training ===
export const updateTraining = createAsyncThunk(
  "trainings/updateTraining",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await API.put(`/trainings/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd aktualizacji treningu");
    }
  }
);

// === DELETE training ===
export const deleteTraining = createAsyncThunk(
  "trainings/deleteTraining",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/trainings/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Błąd usuwania treningu");
    }
  }
);

const trainingSlice = createSlice({
  name: "trainings",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // === FETCH ===
      .addCase(fetchTrainings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload; // array of TrainingResponse
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === CREATE ===
      .addCase(createTraining.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // === UPDATE ===
      .addCase(updateTraining.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.list.findIndex(
          (t) =>
            t.TrainingID === updated.TrainingID ||
            t.trainingID === updated.TrainingID
        );

        if (index !== -1) {
          state.list[index] = updated;
        }
      })

      // === DELETE ===
      .addCase(deleteTraining.fulfilled, (state, action) => {
        const id = action.payload;

        state.list = state.list.filter(
          (t) => t.TrainingID !== id && t.trainingID !== id
        );
      });
  },
});

export default trainingSlice.reducer;
