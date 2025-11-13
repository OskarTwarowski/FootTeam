import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTeams, initializeTeams } from "../../services/TeamService";

// Inicjalizacja lokalnego storage
initializeTeams();

// --- Fetch Teams ---
export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  const teams = getTeams();
  return teams;
});

// --- Add Team ---
export const addTeam = createAsyncThunk("teams/addTeam", async ({ Name }) => {
  const newTeam = {
    TeamID: Date.now(),
    Name,
    TeamCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  const teams = getTeams();
  const updated = [...teams, newTeam];
  localStorage.setItem("Teams", JSON.stringify(updated));

  return newTeam;
});

// --- Update Team ---
export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async (updatedTeam) => {
    const teams = getTeams();
    const index = teams.findIndex((t) => t.TeamID === updatedTeam.TeamID);
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updatedTeam };
      localStorage.setItem("Teams", JSON.stringify(teams));
    }
    return updatedTeam;
  }
);

// --- Delete Team ---
export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (teamID) => {
    const teams = getTeams().filter((t) => t.TeamID !== teamID);
    localStorage.setItem("Teams", JSON.stringify(teams));
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
      // FETCH
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addTeam.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t.TeamID === action.payload.TeamID
        );
        if (index !== -1) state.list[index] = action.payload;
      })

      // DELETE
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.TeamID !== action.payload);
      });
  },
});

export default teamSlice.reducer;
