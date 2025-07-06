import { Box, Typography, IconButton, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { typCart, typProduct } from '../../../../../content/types';

interface Props {
    item: typCart;
    product?: typProduct;
    onDelete: () => void;
}

export default function CartItem({ item, product, onDelete }: Props) {
    const image = product?.image?.[0] ?? '';
    const title = product?.title ?? `Product #${item.productID}`;

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={image} variant="rounded" sx={{ width: 48, height: 48 }} />
                <Box>
                    <Typography fontWeight="bold">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Size: {item.size} | Qty: {item.count}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <Typography>${item.price.toFixed(2)}</Typography>
                <IconButton size="small" color="error" onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
