import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
} from '@mui/material';
import type { typProduct, typOrder } from '../../../content/types';

interface Props {
    product: typProduct | undefined;
    item: typOrder['items'][number];
}

export const OrderItemCard = ({ product, item }: Props) => (
    <Card variant="outlined" sx={{ display: 'flex', mb: 2, alignItems: 'center', pl: 2 }}>
        {product?.image?.[0] && (
            <CardMedia
                component="img"
                image={product.image[0]}
                sx={{ width: 80, height: 80 }}
                alt={product.title}
            />
        )}
        <CardContent sx={{ flex: 1 }}>
            <Typography fontWeight="medium">{product?.title || 'Unknown Product'}</Typography>
            <Typography variant="body2" color="text.secondary">
                Size: {item.size} | Quantity: {item.count}
            </Typography>
            <Typography variant="body2" mt={1}>${item.price.toFixed(2)} each</Typography>
        </CardContent>
        <Box sx={{ px: 2 }}>
            <Typography>${(item.price * item.count).toFixed(2)}</Typography>
        </Box>
    </Card>
);
