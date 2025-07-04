import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import toastReducer from './slices/toastSlice';
import cartReducer from './slices/cartSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        toast: toastReducer,
        cart: cartReducer
    }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
