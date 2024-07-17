import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  role: "client",
};

export const authenticatedSlice = createSlice({
  name: "authenticated",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setCurrentRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthenticated, setCurrentRole } = authenticatedSlice.actions;

export default authenticatedSlice.reducer;
