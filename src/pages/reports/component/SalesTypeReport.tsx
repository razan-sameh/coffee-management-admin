import { PieChart } from '@mui/x-charts';
import { Box, Grid, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react';


const orderPlatformData = [
    { id: 0, value: 614, label: 'Mobile App' },
    { id: 1, value: 200, label: 'Website' },
    { id: 2, value: 354, label: 'Self Order' },
    { id: 3, value: 818, label: 'Offline Order' },
];

const orderTypeData = [
    { id: 0, value: 843, label: 'Dine In' },
    { id: 1, value: 342, label: 'Pickup' },
    { id: 2, value: 718, label: 'Delivery' },
    { id: 3, value: 783, label: 'Takeaway' },
    { id: 4, value: 649, label: 'Reservation' },
];

export const SalesTypeReport: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>Sales Type Report</Typography>
            <Grid container spacing={4} >
                {/* Order Platform Section */}
                <Grid size={12} sx={{ md: 6 }}>
                    <Grid container spacing={4} direction={'row'}>
                        <Grid size={6} >
                            <Typography sx={{ textAlign: 'center' }} variant="h6" gutterBottom>Order Platform</Typography>
                            <PieChart
                                series={[{ data: orderPlatformData }]}
                                width={300}
                                height={200}
                            />
                        </Grid>
                        <Grid size={6} >
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
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>120 Orders</TableCell>
                                                <TableCell>${item.value}.00</TableCell>
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
                    <Grid container spacing={4} direction={'row'}>
                        <Grid size={6} >
                            <Typography sx={{ textAlign: 'center' }} variant="h6" gutterBottom>Order Type</Typography>
                            <PieChart
                                series={[{ data: orderTypeData }]}
                                width={300}
                                height={200}
                            />
                        </Grid>
                        <Grid size={6} >
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
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell>120 Orders</TableCell>
                                                <TableCell>${item.value}.00</TableCell>
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
