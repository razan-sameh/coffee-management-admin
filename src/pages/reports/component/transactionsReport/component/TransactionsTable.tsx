import {
    Box,
    Button,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { typOrder } from '../../../../../content/types';
import { useStaticData } from '../../../../../hook/useStaticData';
import moment from 'moment';

type Props = {
    filteredOrders: typOrder[];
};

const TransactionsTable: React.FC<Props> = ({ filteredOrders }) => {
    const navigate = useNavigate();
    const { users } = useStaticData();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <Box>
                {filteredOrders.map((order, index) => {
                    const user = users[order.userId];
                    return (
                        <Box key={order.id} px={1} py={1}>
                            <Typography fontWeight="bold">
                                Order #{order.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {moment(order.date).format('MMMM D, YYYY HH:mm')}
                            </Typography>

                            <Typography mt={1}>
                                <strong>Customer:</strong>{' '}
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : 'Unknown'}
                            </Typography>

                            <Typography mt={1}>
                                <strong>Items:</strong> {order.items.length}
                            </Typography>
                            <Typography>
                                <strong>Total:</strong> ${order.total.toFixed(2)}
                            </Typography>

                            <Box mt={1}>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/order/${order.id}`)}
                                    startIcon={<VisibilityIcon />}
                                >
                                    View
                                </Button>
                            </Box>

                            {/* Divider between rows */}
                            {index !== filteredOrders.length - 1 && (
                                <Divider sx={{ my: 1 }} />
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    }

    // Desktop table layout
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
                                <TableCell>
                                    <Box>
                                        <Typography># {order.id}</Typography>
                                        <Typography variant="caption">
                                            {moment(order.date).format('MMMM D, YYYY HH:mm')}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : 'Unknown'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
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
