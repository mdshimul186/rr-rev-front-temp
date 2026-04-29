import { createSlice } from "@reduxjs/toolkit";
import { SUCCESS } from "../config/constant";

const initialState = {
  name: "users",
  initialState: {
    users: {},
    status: null,
  },
  isBusinessRegistered: localStorage.getItem("isRegistered"),
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsersData: (state, action) => {
      state.users = action.payload;
      state.status = SUCCESS;
      state.isBusinessRegistered = localStorage.getItem("isRegistered");
    },
  },
});

export const { getUsersData } = userSlice.actions;
export default userSlice.reducer;
