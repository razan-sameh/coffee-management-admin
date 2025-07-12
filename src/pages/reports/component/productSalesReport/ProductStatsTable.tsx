import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Avatar,
    Typography,
} from '@mui/material';
import React from 'react';
import type { ProductStats } from './ProductSalesReport';

const ProductStatsTable: React.FC<{ productStats: ProductStats[] }> = ({ productStats }) => {
    return (
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
    );
};

export default ProductStatsTable;
