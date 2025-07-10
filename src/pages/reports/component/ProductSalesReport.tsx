import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Typography,
} from '@mui/material';
import type { typCategory, typOrder, typProduct } from '../../../content/types';
import { getCategoryById } from '../../../database/select';

type Props = {
    filteredOrders: typOrder[];
    products: Record<string, typProduct>;
};

type ProductStats = {
    ID: string;
    title: string;
    image: string;
    totalOrders: number;
    totalCollected: number;
    category: typCategory;
};

export const ProductSalesReport: React.FC<Props> = ({ filteredOrders, products }) => {
    const [productStats, setProductStats] = useState<ProductStats[]>([]);

    useEffect(() => {
        const computeStats = async () => {
            const stats: Record<string, ProductStats> = {};

            for (const order of filteredOrders) {
                for (const item of order.items || []) {
                    const product = products[item.productID];
                    if (!product) continue;

                    if (!stats[product.ID]) {
                        const category = await getCategoryById(product.category); // use category ID not product.ID
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Item Orders</TableCell>
                            <TableCell>Total Collected</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productStats.map((stat, index) => (
                            <TableRow key={stat.ID}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar src={stat.image} />
                                        <Box>
                                            <Typography>{stat.title}</Typography>
                                            <Typography variant="caption">{stat.category.title}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{stat.totalOrders} Orders</TableCell>
                                <TableCell>${stat.totalCollected.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
