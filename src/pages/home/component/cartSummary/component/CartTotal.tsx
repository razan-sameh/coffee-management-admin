import { Typography } from '@mui/material';

export default function CartTotal({ total }: { total: number }) {
    return <Typography fontWeight="bold">Total: ${total.toFixed(2)}</Typography>;
}
