import type { typOrder, typFilters, typProduct, typCategory } from '../content/types';
import { enmOrderStatus, enmPaymentMethod, enmPlatform, enmOrderType } from '../content/enums';
import { getDateOnly, isSameDay, isSameMonth, isSameYear } from '../utils/dateUtils';

export function filterOrders(
    orders: typOrder[],
    filters: typFilters | undefined,
    products: Record<string, typProduct>,
    categories: Record<string, typCategory>
): typOrder[] {
    const today = new Date();

    if (!filters) return orders;

    let filtered = [...orders];

    if (filters.dateRange?.start && filters.dateRange?.end) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        filtered = filtered.filter(order => {
            const orderDate = getDateOnly(order.date);
            return orderDate && orderDate >= startDate && orderDate <= endDate;
        });
    }

    if (filters.status && filters.status !== enmOrderStatus.all) {
        filtered = filtered.filter(order => {
            const orderDate = getDateOnly(order.date);
            if (!orderDate) return false;
            switch (filters.status) {
                case enmOrderStatus.today:
                    if (!isSameDay(orderDate, today)) return false;
                    break;
                case enmOrderStatus.month:
                    if (!isSameMonth(orderDate, today)) return false;
                    break;
                case enmOrderStatus.year:
                    if (!isSameYear(orderDate, today)) return false;
                    break;
            }
        });
    }

    if (filters.paymentMethod && filters.paymentMethod !== enmPaymentMethod.all) {
        filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod);
    }

    if (filters.platform && filters.platform !== enmPlatform.all) {
        filtered = filtered.filter(order => order.platform === filters.platform);
    }

    if (filters.orderType && filters.orderType !== enmOrderType.all) {
        filtered = filtered.filter(order => order.orderType === filters.orderType);
    }

    if (filters.category && filters.category !== 'All categories') {
        filtered = filtered
            .map(order => {
                const filteredItems = order.items?.filter(item => {
                    const product = products[item.productID];
                    const category = product && categories[product.category];
                    return category?.title === filters.category;
                }) || [];

                return { ...order, items: filteredItems };
            })
            .filter(order => order.items.length > 0);
    }

    if (filters.product && filters.product !== 'All products') {
        filtered = filtered
            .map(order => {
                const filteredItems = order.items?.filter(item => {
                    const product = products[item.productID];
                    return product?.title === filters.product;
                }) || [];

                return { ...order, items: filteredItems };
            })
            .filter(order => order.items.length > 0);
    }

    return filtered;
}
