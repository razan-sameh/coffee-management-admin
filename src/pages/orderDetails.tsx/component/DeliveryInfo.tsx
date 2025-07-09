import { Grid, Typography, Stack } from '@mui/material';
import type { typOrder } from '../../../content/types';

export const DeliveryInfo = ({ info }: { info: typOrder['deliveryInfo'] }) => (
    <Grid size={12}>
        <Typography variant="body2" color="textSecondary" mb={1}>Delivery Info</Typography>
        <Stack spacing={0.5}>
            <Typography><strong>Name:</strong> {info?.name}</Typography>
            <Typography><strong>Phone:</strong> {info?.phone}</Typography>
            <Typography><strong>Address:</strong> {info?.address}</Typography>
        </Stack>
    </Grid>
);
