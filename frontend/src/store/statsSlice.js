// ========================================
// Stats Slice — User Statistics State
// ========================================

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStatsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    },
    setStatsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearStats: (state) => {
      state.stats = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setStatsLoading, setStats, setStatsError, clearStats } =
  statsSlice.actions;

export default statsSlice.reducer;
