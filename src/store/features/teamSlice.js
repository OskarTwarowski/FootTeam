import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";

// === GET all teams ===
export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  const res = await API.get("/teams");
  return res.data;
});

// === CREATE team ===
export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async ({ name, coachId }) => {
    const res = await API.post("/teams", { name, coachId });
    return res.data;
  }
);

// === UPDATE team ===
export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ teamID, name }) => {
    const res = await API.put(`/teams/${teamID}`, { name });
    return res.data;
  }
);

// === DELETE team ===
export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (teamID) => {
    await API.delete(`/teams/${teamID}`);
    return teamID;
  }
);

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === FETCH ===
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // === CREATE ===
      .addCase(createTeam.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // === UPDATE ===
      .addCase(updateTeam.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((t) => t.teamID === updated.teamID);
        if (index !== -1) state.list[index] = updated;
      })

      // === DELETE ===
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.teamID !== action.payload);
      });
  },
});

export default teamSlice.reducer;
