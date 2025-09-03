import { Box, Typography } from '@mui/material';
import type { typOrder } from '../../../content/types';

export const OrderSummary = ({ order }: { order: typOrder }) => (
    <Box textAlign="right" mt={2}>
        {order.SubTotal &&
        <Typography >SubTotal: ${order.SubTotal.toFixed(2)}</Typography>
        }
        {order.delivery &&
        <Typography >Delivery: ${order.delivery.toFixed(2)}</Typography>
        }
        <Typography variant="h6" mt={2}>Total: ${order.total.toFixed(2)}</Typography>
    </Box>
);
