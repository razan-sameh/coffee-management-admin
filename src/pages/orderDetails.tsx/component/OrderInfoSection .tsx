import { Grid, Typography } from '@mui/material';
import type { typOrder, typUser } from '../../../content/types';

interface Props {
    order: typOrder;
    user: typUser | null;
}

export const OrderInfoSection = ({ order, user }: Props) => (
    <Grid container spacing={2}>
        <Grid size={6}>
            <Typography variant="body2" color="textSecondary">User</Typography>
            <Typography>
                {
                    user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'Unknown'
                }
            </Typography>
        </Grid>
        <Grid size={6}>
            <Typography variant="body2" color="textSecondary">Transaction Date</Typography>
            <Typography>{order.date}</Typography>
        </Grid>
        <Grid size={6}>
            <Typography variant="body2" color="textSecondary">Payment Method</Typography>
            <Typography>{order.paymentMethod}</Typography>
        </Grid>
        <Grid size={6}>
            <Typography variant="body2" color="textSecondary">Order Type</Typography>
            <Typography>{order.orderType}</Typography>
        </Grid>
    </Grid>
);
