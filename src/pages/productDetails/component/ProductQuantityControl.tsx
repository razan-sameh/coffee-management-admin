import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { enmAddToCartMode, type enmSize } from '../../../content/enums';
import { getCartItem } from '../../../database/select';
import { addItemToCart } from '../../../database/insert';

type Props = {
    productID: string;
    size: enmSize;
};

export default function ProductQuantityControl({ productID, size }: Props) {
    const uid = useSelector((state: RootState) => state.auth.user?.Uid);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadCartItem = async () => {
            if (!uid) return;
            const item = await getCartItem(uid, productID, size);
            if (item) setQuantity(item.count);
        };
        loadCartItem();
    }, [uid, productID, size]);

    const onIncrement = () => setQuantity(prev => prev + 1);
    const onDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

    const handleAddToCart = async () => {
        if (!uid) return;
        await addItemToCart(uid, productID, size, quantity, enmAddToCartMode.set); // ✅ Firebase only
    };

    return (
        <Box mt={3} display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" onClick={onDecrement}>-</Button>
            <TextField
                value={quantity}
                size="small"
                sx={{ width: 60 }}
                inputProps={{ readOnly: true }}
            />
            <Button variant="outlined" onClick={onIncrement}>+</Button>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
                Add to Cart
            </Button>
        </Box>
    );
}
