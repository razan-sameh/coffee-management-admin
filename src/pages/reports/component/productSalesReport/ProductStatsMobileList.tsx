import React from 'react';
import {
    Box,
    Avatar,
    Typography,
    Divider,
} from '@mui/material';
import type { ProductStats } from './ProductSalesReport';

const ProductStatsMobileList: React.FC<{ productStats: ProductStats[] }> = ({ productStats }) => {
    return (
        <Box>
            {productStats.map((stat, index) => (
                <Box key={stat.ID} px={1} py={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        #{index + 1} - {stat.title}
                    </Typography>

                    <Box display="flex" gap={1}>
                        <Avatar src={stat.image} />
                        <Box>
                            <Typography>{stat.category.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {stat.totalOrders} Orders
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                ${stat.totalCollected.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    {index !== productStats.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
            ))}
        </Box>
    );
};

export default ProductStatsMobileList;
