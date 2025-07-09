import React from 'react';
import {
    Box, Card, CardContent, Typography, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@mui/material';
import type { typOrder, typUser } from '../../../content/types';

type Props = {
    orders: typOrder[];
    users: Record<string, typUser>; // map by userId
};

export const TransactionsReport: React.FC<Props> = ({ orders, users }) => {
    const totalTransactions = orders.length;
    const orderCanceled = orders.length;
    const newOrders = orders.slice(0, 3); // Sample new orders to display

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Transactions Report</Typography>
            <Grid container spacing={2} mb={2}>
                <SummaryCard label="Total Transactions" value={totalTransactions} info="+$1,802.00" color="#b9a48f" />
                <SummaryCard label="New Order" value={3} info="Potential +$120.00" color="#b3f4e6" />
                <SummaryCard label="Order Processed" value={20} info="Potential +$120.00" color="#ffe49e" />
                <SummaryCard label="Order Shipped" value={239} info="Potential +$802.00" color="#c7efff" />
                <SummaryCard label="Order Canceled" value={orderCanceled} info="Losses -$500.00" color="#ffbaba" />
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newOrders.map(order => {
                            const user = users[order.userId];
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        <Typography>{user?.firstName} {user?.lastName}</Typography>
                                        <Typography variant="caption">{user?.address?.[0]}</Typography>
                                    </TableCell>
                                    <TableCell>{order.items.length}</TableCell>
                                    <TableCell>${order.total}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="outlined">New Order</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small">View</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const SummaryCard = ({
    label,
    value,
    info,
    color,
}: {
    label: string;
    value: number;
    info: string;
    color: string;
}) => (
    <Card sx={{ backgroundColor: color, flex: '1'}}>
        <CardContent>
            <Typography variant="subtitle1">{label}</Typography>
            <Typography variant="h6">{value}</Typography>
            <Typography variant="caption">{info}</Typography>
        </CardContent>
    </Card>
);
