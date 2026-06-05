// ========================================
// Detection Slice — Detection State
// ========================================

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedImage: null,
  previewUrl: null,
  result: null,
  loading: false,
  error: null,
};

const detectionSlice = createSlice({
  name: 'detection',
  initialState,
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload.file;
      state.previewUrl = action.payload.previewUrl;
      state.result = null;
      state.error = null;
    },
    setDetectionLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setDetectionResult: (state, action) => {
      state.result = action.payload;
      state.loading = false;
    },
    setDetectionError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetDetection: (state) => {
      state.selectedImage = null;
      state.previewUrl = null;
      state.result = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedImage,
  setDetectionLoading,
  setDetectionResult,
  setDetectionError,
  resetDetection,
} = detectionSlice.actions;

export default detectionSlice.reducer;
