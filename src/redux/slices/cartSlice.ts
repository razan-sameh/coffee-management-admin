// redux/slices/cartSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { typCart } from '../../content/types';
import type { enmSize } from '../../content/enums';

interface CartState {
    items: typCart[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<typCart>) => {
            const existing = state.items.find(
                item =>
                    item.productID === action.payload.productID &&
                    item.size === action.payload.size
            );

            if (existing) {
                existing.count += action.payload.count;
                existing.price += action.payload.price;
            } else {
                state.items.push(action.payload);
            }
        },

        removeFromCart: (state, action: PayloadAction<{ productID: number; size: enmSize }>) => {
            state.items = state.items.filter(
                item =>
                    !(item.productID === action.payload.productID && item.size === action.payload.size)
            );
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
