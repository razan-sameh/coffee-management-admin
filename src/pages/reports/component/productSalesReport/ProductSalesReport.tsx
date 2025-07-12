import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import ProductStatsMobileList from './ProductStatsMobileList';
import ProductStatsTable from './ProductStatsTable';
import type { typCategory, typOrder, typProduct } from '../../../../content/types';
import { getCategoryById } from '../../../../database/select';

type Props = {
    filteredOrders: typOrder[];
    products: Record<string, typProduct>;
};
export type ProductStats = {
  ID: string;                     // Product ID
  title: string;                 // Product title/name
  image: string;                 // Product's image URL
  totalOrders: number;          // Total count of ordered items
  totalCollected: number;       // Total revenue generated from this product
  category: typCategory;        // Category object the product belongs to
};
export const ProductSalesReport: React.FC<Props> = ({ filteredOrders, products }) => {
    const [productStats, setProductStats] = useState<ProductStats[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const computeStats = async () => {
            const stats: Record<string, ProductStats> = {};

            for (const order of filteredOrders) {
                for (const item of order.items || []) {
                    const product = products[item.productID];
                    if (!product) continue;

                    if (!stats[product.ID]) {
                        const category = await getCategoryById(product.category);
                        if (!category) continue;

                        stats[product.ID] = {
                            ID: product.ID,
                            title: product.title,
                            image: product.image[0],
                            totalOrders: 0,
                            totalCollected: 0,
                            category,
                        };
                    }

                    stats[product.ID].totalOrders += item.count;
                    stats[product.ID].totalCollected += item.count * item.price;
                }
            }

            setProductStats(Object.values(stats));
        };

        computeStats();
    }, [filteredOrders, products]);

    return (
        <Box>
            {isMobile
                ? <ProductStatsMobileList productStats={productStats} />
                : <ProductStatsTable productStats={productStats} />}
        </Box>
    );
};
