import { Box, Typography, Rating } from '@mui/material';

type Props = {
    price: number;
    rating: number | null;
    description: string;
};

export default function ProductPriceAndRating({ price, rating, description }: Props) {
    return (
        <>
            <Box mt={1}>
                <Rating value={rating} precision={0.5} readOnly />
            </Box>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Typography variant="h6">${price}</Typography>
            </Box>
            <Typography mt={2} color="text.secondary">{description}</Typography>
        </>
    );
}
