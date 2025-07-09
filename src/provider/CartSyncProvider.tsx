import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { typCart } from '../content/types';
import type { RootState } from '../redux/store';
import { listenToCart, getMultipleProducts } from '../database/select';
import { setCart, setProducts } from '../redux/slices/cartSlice';

const CartSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const uid = useSelector((state: RootState) => state.auth.user?.Uid);

    useEffect(() => {
        if (!uid) return;

        // Start listening to cart updates
        const unsubscribe = listenToCart(uid, async (cartItems: typCart[]) => {
            dispatch(setCart(cartItems));

            // Get unique product IDs from cart
            const productIds = [...new Set(cartItems.map((item) => item.productID))];

            // Fetch product details and dispatch
            const products = await getMultipleProducts(productIds);
            dispatch(setProducts(products));
        });

        // Cleanup on unmount or uid change
        return () => unsubscribe();
    }, [uid, dispatch]);

    return <>{children}</>;
};

export default CartSyncProvider;
