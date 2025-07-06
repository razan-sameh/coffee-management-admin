import { Box, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function CartHeader() {
    return (
        <Box display="flex" alignItems="center">
            <ShoppingCartIcon />
            <Typography variant="title" sx={{ ml: 1 }}>
                My Cart
            </Typography>
        </Box>
    );
}
