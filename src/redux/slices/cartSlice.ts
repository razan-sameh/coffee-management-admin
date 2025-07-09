/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { createOrder } from '../../database/insert';
import { clearCart as clearCartDB } from '../../database/delete';
import type { typCart, typProduct, typOrder } from '../../content/types';
import { type enmSize, enmToastSeverity } from '../../content/enums';
import { setToast } from './toastSlice';

interface CartState {
    items: typCart[];
    products: Record<string, typProduct>;
    loading: boolean;
}

const initialState: CartState = {
    items: [],
    products: {},
    loading: false,
};

// ✅ Reusable Thunk to Place Order using `typOrder`
export const placeOrder = createAsyncThunk<
    void, // return type
    Omit<typOrder,'id' | 'date'>,
    { rejectValue: string }
>(
    'cart/placeOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            await createOrder(orderData);
            await clearCartDB(orderData.userId);
            dispatch(clearCart());
            dispatch(
                setToast({
                    message: 'Order placed successfully',
                    severity: enmToastSeverity.success,
                })
            );
        } catch (error: any) {
            dispatch(
                setToast({
                    message: `Failed to place order: ${error.message || error}`,
                    severity: enmToastSeverity.error,
                })
            );
            return rejectWithValue(error.message || 'Unknown error');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<typCart[]>) => {
            state.items = action.payload;
        },
        setProducts: (state, action: PayloadAction<Record<string, typProduct>>) => {
            state.products = action.payload;
        },
        removeFromCart: (
            state,
            action: PayloadAction<{ productID: string; size: enmSize }>
        ) => {
            state.items = state.items.filter(
                (item) =>
                    !(item.productID === action.payload.productID &&
                        item.size === action.payload.size)
            );
        },
        clearCart: (state) => {
            state.items = [];
            state.products = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(placeOrder.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setCart, setProducts, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
