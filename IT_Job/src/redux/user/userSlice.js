import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = action.payload.isLoading;
    },
    clearDataUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, clearDataUser } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsLoading = (state) => state.user.isLoading;

export const userReducer = userSlice.reducer;