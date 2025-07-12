import React, { useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import ReportChartSection from './ReportChartSection';
import { enmPlatform } from '../../../../content/enums';
import type { typOrder } from '../../../../content/types';

type Props = {
    filteredOrders: typOrder[];
};

type ReportItem = {
    label: string;
    value: number;
    collected: number;
};

export const SalesTypeReport: React.FC<Props> = ({ filteredOrders }) => {
    const orderPlatformData: ReportItem[] = useMemo(() => {
        const stats: Record<string, ReportItem> = {};
        for (const order of filteredOrders) {
            const platform = order.platform || enmPlatform.mobile;
            if (!stats[platform]) {
                stats[platform] = { label: platform, value: 0, collected: 0 };
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
                stats[type] = { label: type, value: 0, collected: 0 };
            }
            stats[type].value += 1;
            stats[type].collected += order.total;
        }
        return Object.values(stats);
    }, [filteredOrders]);

    return (
        <Box>
            <Grid container spacing={4} direction="column">
                <ReportChartSection
                    title="Order Platform"
                    chartData={orderPlatformData}
                    tableTitle="Platform"
                />
                <ReportChartSection
                    title="Order Type"
                    chartData={orderTypeData}
                    tableTitle="Type"
                />
            </Grid>
        </Box>
    );
};
