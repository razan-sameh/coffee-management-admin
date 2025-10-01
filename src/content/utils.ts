import moment from "moment";
import type { typOrder, typProduct, typUser } from "./types";
import { enmOrderStatus, enmOrderType } from "./enums";

export const getWeeklyDataByCurrentMonth = (
  orders: typOrder[],
  weekInMonth: number // 1..5
) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sales = Array(7).fill(0);
  const revenue = Array(7).fill(0);

  const now = moment();
  const currentMonth = now.month() + 1; // 1-12
  const currentYear = now.year();

  orders.forEach((order) => {
    const date = moment(order.date);
    if (date.month() + 1 === currentMonth && date.year() === currentYear) {
      // Calculate week of month (1-based)
      const weekOfMonth = Math.ceil(
        (date.date() + moment(date).startOf("month").day()) / 7
      );

      if (weekOfMonth === weekInMonth) {
        const dayIndex = date.isoWeekday() - 1; // Mon=0
        order.items.forEach((item) => {
          sales[dayIndex] += item.count;
        });
        revenue[dayIndex] += order.total;
      }
    }
  });

  return { labels, sales, revenue };
};

export const getYearlyData = (orders: typOrder[], year: number) => {
  const labels = moment.monthsShort(); // ["Jan", "Feb", ...]
  const sales = Array(12).fill(0);
  const revenue = Array(12).fill(0);

  orders.forEach((order) => {
    const date = moment(order.date);
    if (date.year() === year) {
      const monthIndex = date.month(); // 0-11
      order.items.forEach((item) => {
        sales[monthIndex] += item.count;
      });
      revenue[monthIndex] += order.total;
    }
  });

  return { labels, sales, revenue };
};

export const getMonthlyData = (
  orders: typOrder[],
  month: number,
  year: number
) => {
  const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const sales = Array(5).fill(0);
  const revenue = Array(5).fill(0);

  orders.forEach((order) => {
    const date = moment(order.date);
    if (date.month() + 1 === month && date.year() === year) {
      const weekIndex = date.week() - moment(date).startOf("month").week();
      order.items.forEach((item) => {
        sales[weekIndex] += item.count;
      });
      revenue[weekIndex] += order.total;
    }
  });

  // Trim empty last week if needed
  while (
    sales.length > 0 &&
    sales[sales.length - 1] === 0 &&
    revenue[revenue.length - 1] === 0
  ) {
    sales.pop();
    revenue.pop();
    labels.pop();
  }

  return { labels, sales, revenue };
};

export const getCustomData = (
  orders: typOrder[],
  weekInMonth: number,
  month: number, // 1-12
  year: number
) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sales = Array(7).fill(0);
  const revenue = Array(7).fill(0);

  orders.forEach((order) => {
    const date = moment(order.date);
    if (date.month() + 1 === month && date.year() === year) {
      const weekOfMonth = Math.ceil(
        (date.date() + moment(date).startOf("month").day()) / 7
      );

      if (weekOfMonth === weekInMonth) {
        const dayIndex = date.isoWeekday() - 1; // Mon=0
        order.items.forEach((item) => {
          sales[dayIndex] += item.count;
        });
        revenue[dayIndex] += order.total;
      }
    }
  });

  return { labels, sales, revenue };
};

/** ✅ Get New Orders (today’s orders or recent ones) */
export function getNewOrders(orders: typOrder[]) {
  const today = moment().startOf("day");
  const filtered = orders.filter((o) => moment(o.date).isSameOrAfter(today));

  return {
    count: filtered.length,
    total: filtered.reduce((sum, o) => sum + o.total, 0),
  };
}

/** ✅ Get Processed Orders (Delivered) */
export function getProcessedOrders(orders: typOrder[]) {
  const filtered = orders.filter((o) => o.status === enmOrderStatus.Delivered);

  return {
    count: filtered.length,
    total: filtered.reduce((sum, o) => sum + o.total, 0),
  };
}

/** ✅ Get Shipped Orders (Delivery type) */
export function getShippedOrders(orders: typOrder[]) {
  const filtered = orders.filter((o) => o.orderType === enmOrderType.delivery);

  return {
    count: filtered.length,
    total: filtered.reduce((sum, o) => sum + o.total, 0),
  };
}

/** ✅ Get New Customers This Month and calculate growth */
export function getNewCustomersThisMonth(users: typUser[]) {
  const today = moment();

  // This month
  const startOfThisMonth = today.clone().startOf("month");
  const endOfThisMonth = today.clone().endOf("month");
  const thisMonthCustomers = users.filter(
    (u: typUser) =>
      u.createdAt &&
      moment(u.createdAt).isBetween(
        startOfThisMonth,
        endOfThisMonth,
        undefined,
        "[]"
      )
  );

  // Last month
  const startOfLastMonth = today.clone().subtract(1, "month").startOf("month");
  const endOfLastMonth = today.clone().subtract(1, "month").endOf("month");
  const lastMonthCustomers = users.filter(
    (u: typUser) =>
      u.createdAt &&
      moment(u.createdAt).isBetween(
        startOfLastMonth,
        endOfLastMonth,
        undefined,
        "[]"
      )
  );

  // Calculate growth %
  const lastCount = lastMonthCustomers.length;
  const thisCount = thisMonthCustomers.length;
  const growth =
    lastCount === 0
      ? 100 // if no users last month, assume 100% growth
      : ((thisCount - lastCount) / lastCount) * 100;

  return {
    count: thisCount,
    growth: growth.toFixed(1) + "%", // "5.0%" format
    trend: thisCount >= lastCount ? 1 : -1,
  };
}

/** ✅ Get Top Selling Products */
export function getTopSellingProducts(
  orders: typOrder[],
  products: typProduct[],
  topN: number = 6
): typProduct[] {
  const productSales: Record<string, number> = {};

  // Count the total sold for each product
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.productID]) {
        productSales[item.productID] = 0;
      }
      productSales[item.productID] += item.count;
    });
  });

  // Sort products by total sold and return the actual typProduct
const sortedProducts = Object.entries(productSales)
  .sort((a, b) => b[1] - a[1])
  .slice(0, topN)
  .map(([productId]) => {
    const product = products.find((p) => p.ID.toString() === productId.toString());
    return product ?? null;
  })
  .filter((p): p is typProduct => p !== null);


  return sortedProducts;
}


