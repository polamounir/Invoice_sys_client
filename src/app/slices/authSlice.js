// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "loading";
    },
    loginSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    loginFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout, setUser } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
