import { Box, Typography } from '@mui/material';

export const OrderSummary = ({ total }: { total: number }) => (
    <Box textAlign="right" mt={2}>
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
    </Box>
);
