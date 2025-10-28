import { createSlice } from "@reduxjs/toolkit";
import { addUser, getUsers } from "../../services/AuthService";

const initialState = {
  users: getUsers(),
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const newUser = action.payload;

      const userExists = state.users.some((u) => u.Email === newUser.Email);
      if (userExists) {
        state.error = "Użytkownik o tym e-mailu już istnieje!";
        return;
      }
      state.users.push(newUser);
      addUser(newUser);
      state.status = "succeeded";
    },
    clearRegisterError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
});

export const { registerUser, clearRegisterError } = registerSlice.actions;

export default registerSlice.reducer;
