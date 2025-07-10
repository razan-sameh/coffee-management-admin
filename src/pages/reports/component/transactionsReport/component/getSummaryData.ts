/* eslint-disable @typescript-eslint/no-explicit-any */
// helpers/getSummaryData.ts

import type { Theme } from "@mui/material/styles";
import type { typOrder } from "../../../../../content/types";

type SummaryItem = {
    label: string;
    value: number;
    info: string;
    color: string;
};

export const getSummaryData = (
    theme: Theme,
    dailyOrders: typOrder[],
    monthlyOrders: typOrder[],
    yearlyOrders: typOrder[],
    allOrders: typOrder[]
): SummaryItem[] => {
    const total = (orders: typOrder[]) =>
        `Total +$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}`;
    return [
        {
            label: 'Daily Transactions',
            value: dailyOrders.length,
            info: total(dailyOrders),
            color: theme.palette.background.default,


        },
        {
            label: 'Monthly Transactions',
            value: monthlyOrders.length,
            info: total(monthlyOrders),
            color: '#f9c06a5c',


        },
        {
            label: 'Yearly Transactions',
            value: yearlyOrders.length,
            info: total(yearlyOrders),
            color: theme.palette.primary.main,


        },
        {
            label: 'Total Transactions',
            value: allOrders.length,
            info: total(allOrders),
            color: 'rgba(0, 0, 0, 0.12)',

        },
    ];
};
