// ========================================
// Redux Store Configuration
// ========================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import detectionReducer from './detectionSlice';
import statsReducer from './statsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    detection: detectionReducer,
    stats: statsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable file objects in detection slice
        ignoredActions: ['detection/setSelectedImage'],
        ignoredPaths: ['detection.selectedImage'],
      },
    }),
});

export default store;
