// redux/slices/cartSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { typCart } from '../../content/types';
import { type enmSize } from '../../content/enums';

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
        // 🔄 Called from `listenToCart` when Firebase updates
        setCart: (state, action: PayloadAction<typCart[]>) => {
            state.items = action.payload;
        },

        // 🧪 Optional: may use later
        removeFromCart: (state, action: PayloadAction<{ productID: string; size: enmSize }>) => {
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

export const { setCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
