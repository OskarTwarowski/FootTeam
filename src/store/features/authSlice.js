import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/axios";

export const initialState = {
  user: JSON.parse(localStorage.getItem("loggedUser")) || null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};
// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      // backend zwraca: token, userId, email, role
      const user = {
        userId: data.userId,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedUser", JSON.stringify(user));

      return { user, token: data.token };
    } catch (err) {
      return thunkAPI.rejectWithValue("Nieprawidłowy email lub hasło");
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, role }, thunkAPI) => {
    try {
      const res = await API.post("/auth/register", {
        email,
        password,
        role,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Rejestracja nie powiodła się");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("token");
      localStorage.removeItem("activeProfile");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
