import { configureStore } from '@reduxjs/toolkit';
import { progressApi } from '../features/apiSlice';

export const store = configureStore({
  reducer: {
    [progressApi.reducerPath]: progressApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(progressApi.middleware),
});
