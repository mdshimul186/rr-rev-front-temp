import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: null,
  token: localStorage.getItem("authToken") || null,
  tokenExpiry: localStorage.getItem("tokenExpiry") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  registerCounter: 1,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry;
      state.isAuthenticated = true;
      localStorage.setItem("authToken", state.token);
      localStorage.setItem("tokenExpiry", state.tokenExpiry);
    },
    clearToken: (state) => {
      state.token = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("contact");
      localStorage.setItem("isRegistered", false);
    },
    setAuthToken: (state, action) => {
      localStorage.setItem("verificationToken", action.payload);
      state.authToken = action.payload;
    },
    setRegisterCounter: (state) => {
      state.registerCounter += 1;
    },
    clearRegisterCounter: (state) => {
      state.registerCounter = 1;
    },
  },
});

export const {
  setToken,
  clearToken,
  setAuthToken,
  setRegisterCounter,
  clearRegisterCounter,
} = authSlice.actions;
export default authSlice.reducer;
