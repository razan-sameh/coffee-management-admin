import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type {
    typOrder,
} from '../../../../../content/types';
import { useStaticData } from '../../../../../hook/useStaticData';


type Props = {
    filteredOrders: typOrder[]
};

const TransactionsTable: React.FC<Props> = ({
    filteredOrders
}) => {
    const navigate = useNavigate();
    const { users } = useStaticData();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredOrders.map((order) => {
                        const user = users[order.userId];
                        return (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                    <Typography>
                                        {user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : "Unknown"}
                                    </Typography>
                                    <Typography variant="caption">
                                        {user?.address?.[0]}
                                    </Typography>
                                </TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => navigate(`/order/${order.id}`)}>
                                        <VisibilityIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionsTable;
