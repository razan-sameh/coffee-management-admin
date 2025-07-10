// hooks/useFilteredOrders.ts
import { useMemo } from 'react';
import type { typOrder } from '../content/types';
import { getDateOnly, isSameDay, isSameMonth, isSameYear } from '../utils/dateUtils';

export const useFilteredOrders = (orders: typOrder[]) => {
    const today = new Date();

    return useMemo(() => {
        const daily = orders.filter(o => {
            const d = getDateOnly(o.date);
            return d && isSameDay(d, today);
        });

        const monthly = orders.filter(o => {
            const d = getDateOnly(o.date);
            return d && isSameMonth(d, today);
        });

        const yearly = orders.filter(o => {
            const d = getDateOnly(o.date);
            return d && isSameYear(d, today);
        });

        return { daily, monthly, yearly };
    }, [orders]);
};
