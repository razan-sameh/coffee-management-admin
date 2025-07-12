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
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { PieChart } from '@mui/x-charts';
import React from 'react';

type ReportItem = {
    label: string;
    value: number;
    collected: number;
};

type Props = {
    title: string;
    chartData: ReportItem[];
    tableTitle: string;
};

const ReportChartSection: React.FC<Props> = ({ title, chartData, tableTitle }) => {
    const theme = useTheme();
    const isCompact = useMediaQuery('(max-width:800px)');
    const platformColors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
    ];

    return (
        <Grid size={{ xs: 12 }}>
            <Grid
                container
                spacing={2}
                direction={isCompact ? 'column' : 'row'}
                alignItems="center"
            >
                <Grid size={{ xs: 12, sm: isCompact ? 12 : 5 }}>
                    <Box display="flex" flexDirection="column">
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ textAlign: isCompact ? 'center' : 'left' }}
                        >
                            {title}
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: chartData.map((d, i) => ({
                                        id: i,
                                        value: d.value,
                                        label: d.label,
                                        color: platformColors[i % platformColors.length],
                                    })),
                                },
                            ]}
                            width={isCompact ? 250 : 300}
                            height={200}
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: isCompact ? 12 : 7 }}>
                    <TableContainer
                        component={Paper}
                        sx={{ mt: { xs: 1, sm: 2 }, overflowX: 'auto' }}
                    >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>{tableTitle}</TableCell>
                                    <TableCell>Order</TableCell>
                                    <TableCell>Collected</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chartData.map((item, index) => (
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
    );
};

export default ReportChartSection;
