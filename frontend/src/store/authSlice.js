import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    hydrated: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.hydrated = true;
    },
    clearUser(state) {
      state.user = null;
      state.hydrated = true;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
