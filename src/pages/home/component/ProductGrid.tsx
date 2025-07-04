import { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Rating,
    IconButton,
    Pagination,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { addItemInCart } from '../../../database/insert';
import type { typProduct } from '../../../content/types';
import { enmSize } from '../../../content/enums';
import type { RootState } from '../../../redux/store';

type Props = {
    products: typProduct[];
};

const ITEMS_PER_PAGE = 8;

export default function ProductGrid({ products }: Props) {
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
    const uid = useSelector((state: RootState) => state.auth.user?.Uid);

    // Track size per product
    const [selectedSizes, setSelectedSizes] = useState<Record<string, enmSize>>({});

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSizeChange = (productID: string, size: enmSize) => {
        setSelectedSizes((prev) => ({ ...prev, [productID]: size }));
    };

    const handleAddToCart = (productID: string) => {
        const size = selectedSizes[productID] || enmSize.medium;
        if (!uid) {
            alert('User not logged in');
            return;
        }

        addItemInCart(uid, productID, size, 1)
            .then(() => alert('✅ Added to cart'))
            .catch((err) => console.error('Error adding to cart:', err));
    };

    const paginatedProducts = products.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <Box>
            <Grid container spacing={2}>
                {paginatedProducts.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.ID}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 1 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image[0]}
                                alt={product.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {product.title}
                                </Typography>
                                <Rating value={product.rate} readOnly size="small" />

                                {/* Size selector per product */}
                                <ToggleButtonGroup
                                    exclusive
                                    value={selectedSizes[product.ID] || enmSize.medium}
                                    onChange={(_, val) => val && handleSizeChange(product.ID, val)}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {Object.values(enmSize).map((sz) => (
                                        <ToggleButton
                                            key={sz}
                                            value={sz}
                                            sx={{
                                                px: 2,
                                                py: 0.5,
                                                fontWeight: 'bold',
                                                borderRadius: '20px',
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                            }}
                                            size="small"
                                        >
                                            {sz}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>

                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                                    <Typography fontWeight="bold">
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                    <IconButton onClick={() => handleAddToCart(product.ID)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
}
