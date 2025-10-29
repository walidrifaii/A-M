// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './api/productsApi';
import { checkoutApi } from './api/checkoutApi';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
