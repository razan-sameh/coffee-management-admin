import { useState } from 'react';
import {
    Box, Grid, Card, CardContent, CardMedia,
    Typography, Rating, IconButton, Pagination,
    ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector, useDispatch } from 'react-redux';
import type { typProduct } from '../../../content/types';
import { enmAddToCartMode, enmSize, enmToastSeverity } from '../../../content/enums';
import type { RootState } from '../../../redux/store';
import { setToast } from '../../../redux/slices/toastSlice';
import { addItemToCart } from '../../../database/insert';

type Props = {
    products: typProduct[];
};

const ITEMS_PER_PAGE = 8;

export default function ProductGrid({ products }: Props) {
    const [page, setPage] = useState(1);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, enmSize>>({});
    const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
    const uid = useSelector((state: RootState) => state.auth.user?.Uid);
    const dispatch = useDispatch();

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSizeChange = (productID: string, size: enmSize) => {
        setSelectedSizes(prev => ({ ...prev, [productID]: size }));
    };

    const handleAddToCart = async (product: typProduct) => {
        const size = selectedSizes[product.ID] || enmSize.medium;

        if (!uid) {
            dispatch(setToast({
                message: 'User not logged in',
                severity: enmToastSeverity.warning,
            }));
            return;
        }

        try {
            await addItemToCart(uid, product.ID, size, 1, enmAddToCartMode.increment); // ✅ Firebase only
        } catch (err) {
            dispatch(setToast({
                message: `Error adding to cart: ${err}`,
                severity: enmToastSeverity.error,
            }));
        }
    };

    const paginatedProducts = products.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <Box>
            <Grid container spacing={2}>
                {paginatedProducts.map(product => (
                    <Grid key={product.ID} size={{ xs: 12, sm: 6, md: 3 }}>
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

                                <ToggleButtonGroup
                                    exclusive
                                    value={selectedSizes[product.ID] || enmSize.medium}
                                    onChange={(_, val) => val && handleSizeChange(product.ID, val)}
                                    sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}
                                >
                                    {Object.values(enmSize).map(sz => (
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
                                    <IconButton onClick={() => handleAddToCart(product)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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
