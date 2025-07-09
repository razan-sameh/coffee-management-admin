import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Avatar } from '@mui/material';
import type { typProduct } from '../../../content/types';

type Props = {
    products: typProduct[];
};

export const ProductSalesReport: React.FC<Props> = ({ products }) => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>Product Sales Report</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Item Order</TableCell>
                            <TableCell>Total Collected</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.ID}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar src={product.image[0]} />
                                        <Box>
                                            <Typography>{product.title}</Typography>
                                            <Typography variant="caption">Coffee and Beverage</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>120 Orders</TableCell>
                                <TableCell>$600.00</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
