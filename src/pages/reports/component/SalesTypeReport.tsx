import { PieChart } from '@mui/x-charts';
import {
    Box,
    Grid,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    useTheme,
} from '@mui/material';
import React, { useMemo } from 'react';
import type { typOrder } from '../../../content/types';
import { enmPlatform } from '../../../content/enums';

type Props = {
    filteredOrders: typOrder[];
};

type ReportItem = {
    label: string;
    value: number;
    collected: number;
};

export const SalesTypeReport: React.FC<Props> = ({ filteredOrders }) => {
    const theme = useTheme();
    const platformColors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
    ];

    const orderPlatformData: ReportItem[] = useMemo(() => {
        const stats: Record<string, ReportItem> = {};

        for (const order of filteredOrders) {
            const platform = order.platform;
            if (!stats[platform]) {
                stats[platform] = {
                    label: platform || enmPlatform.mobile,
                    value: 0,
                    collected: 0,
                };
            }
            stats[platform].value += 1;
            stats[platform].collected += order.total;
        }

        return Object.values(stats);
    }, [filteredOrders]);

    const orderTypeData: ReportItem[] = useMemo(() => {
        const stats: Record<string, ReportItem> = {};

        for (const order of filteredOrders) {
            const type = order.orderType;
            if (!stats[type]) {
                stats[type] = {
                    label: type,
                    value: 0,
                    collected: 0,
                };
            }
            stats[type].value += 1;
            stats[type].collected += order.total;
        }

        return Object.values(stats);
    }, [filteredOrders]);
    return (
        <Box>
            <Grid container spacing={4} >
                {/* Order Platform Section */}
                <Grid size={12} sx={{ md: 6, mb: 2 }}>
                    <Grid container spacing={4} direction={'row'} alignItems={'center'}>
                        <Grid size={4} >
                            <Typography sx={{ textAlign: 'center' }} variant="h6" gutterBottom>Order Platform</Typography>
                            <PieChart
                                series={[{
                                    data: orderPlatformData.map((d, i) => ({
                                        id: i,
                                        value: d.value,
                                        label: d.label,
                                        color: platformColors[i % platformColors.length], // ✅ assign color from theme
                                    })),
                                }]}
                                width={300}
                                height={200}
                            />
                        </Grid>
                        <Grid size={7} >
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Platform</TableCell>
                                            <TableCell>Order</TableCell>
                                            <TableCell>Collected</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderPlatformData.map((item, index) => (
                                            <TableRow key={item.label}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>{item.value} Orders</TableCell>
                                                <TableCell>${item.collected.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Order Type Section */}
                <Grid size={12} sx={{ md: 6 }}>
                    <Grid container spacing={4} direction={'row'} alignItems={'center'}>
                        <Grid size={4} >
                            <Typography sx={{ textAlign: 'center' }} variant="h6" gutterBottom>Order Type</Typography>
                            <PieChart
                                series={[{
                                    data: orderTypeData.map((d, i) => ({
                                        id: i,
                                        value: d.value,
                                        label: d.label,
                                        color: platformColors[i % platformColors.length], // ✅ assign color from theme
                                    })),
                                }]}
                                width={300}
                                height={200}
                            />
                        </Grid>
                        <Grid size={7} >
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Order</TableCell>
                                            <TableCell>Collected</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderTypeData.map((item, index) => (
                                            <TableRow key={item.label}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>{item.value} Orders</TableCell>
                                                <TableCell>${item.collected.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};
