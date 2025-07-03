import { Box, Button, TextField } from '@mui/material';

type Props = {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
};

export default function ProductQuantityControl({ quantity, onIncrement, onDecrement }: Props) {
    return (
        <Box mt={3} display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" onClick={onDecrement}>-</Button>
            <TextField
                value={quantity}
                size="small"
                sx={{ width: 60 }}
            />
            <Button variant="outlined" onClick={onIncrement}>+</Button>
            <Button variant="contained" color="primary">Add to Cart</Button>
        </Box>
    );
}
