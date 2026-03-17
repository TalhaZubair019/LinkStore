import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import cartReducer from './slices/CartSlice';
import adminMarketplaceReducer from './slices/AdminMarketplaceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    adminMarketplace: adminMarketplaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
