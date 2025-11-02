import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTrainings,
  addTraining as addTrainingService,
  updateTraining as updateTrainingService,
  removeTraining as removeTrainingService,
} from "../../services/TrainingService";

// --- THUNKI --- //
export const fetchTrainings = createAsyncThunk(
  "trainings/fetchTrainings",
  async () => await getTrainings()
);

export const addTraining = createAsyncThunk(
  "trainings/addTraining",
  async (newTraining) => await addTrainingService(newTraining)
);

export const updateTraining = createAsyncThunk(
  "trainings/updateTraining",
  async (updatedTraining) => await updateTrainingService(updatedTraining)
);

export const removeTraining = createAsyncThunk(
  "trainings/removeTraining",
  async (training) => await removeTrainingService(training)
);

// --- SLICE --- //
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
      // Pobieranie
      .addCase(fetchTrainings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Dodawanie
      .addCase(addTraining.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Aktualizacja
      .addCase(updateTraining.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(
          (t) =>
            t.TrainingID === updated.TrainingID ||
            t.trainingID === updated.trainingID
        );
        if (index !== -1) {
          state.list[index] = updated;
        }
      })

      // Usuwanie
      .addCase(removeTraining.fulfilled, (state, action) => {
        const removed = action.payload;
        state.list = state.list.filter(
          (t) =>
            t.TrainingID !== removed.TrainingID &&
            t.trainingID !== removed.trainingID
        );
      });
  },
});

export default trainingSlice.reducer;
