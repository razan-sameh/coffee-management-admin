/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import type { typOrder } from '../../../../content/types';
import SummaryCard from './component/SummaryCard';
import TransactionsTable from './component/TransactionsTable';
import { useFilteredOrders } from '../../../../hook/useFilteredOrders';
import { getSummaryData } from './component/getSummaryData';

type Props = {
    filteredOrders: typOrder[];
};

export const TransactionsReport: React.FC<Props> = ({ filteredOrders }) => {
    const theme = useTheme();
    const { daily, monthly, yearly } = useFilteredOrders(filteredOrders);

    const summaryData = useMemo(
        () => getSummaryData(theme, daily, monthly, yearly, filteredOrders),
        [daily, monthly, yearly, filteredOrders, theme]
    );

    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                {summaryData.map((item: any, index: number) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <SummaryCard {...item} />
                    </Grid>
                ))}
            </Grid>

            {/* Responsive table/card view */}
            <Box sx={{ mt: 2 }}>
                <TransactionsTable filteredOrders={filteredOrders} />
            </Box>
        </Box>
    );
};
