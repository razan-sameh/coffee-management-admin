import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import type { typOrder } from "../content/types";
import { getWeeklyDataByCurrentMonth, getMonthlyData, getYearlyData, getCustomData } from "../content/utils";
import { getAllOrders } from "../database/select";


export type DurationType = "weekly" | "monthly" | "yearly" | "Custom";

export const useSalesChart = () => {
  const [orders, setOrders] = useState<typOrder[]>([]);
  const [duration, setDuration] = useState<DurationType>("weekly");
  const [subFilter, setSubFilter] = useState<string>("Week 1");

  // Custom filters
  const [customWeek, setCustomWeek] = useState<number>(1);
  const [customMonth, setCustomMonth] = useState<number>(
    moment().month() + 1
  ); // 1-12
  const [customYear, setCustomYear] = useState<number>(moment().year());

  // Load orders
  useEffect(() => {
    const unsubscribe = getAllOrders((data) => {
      setOrders(Object.values(data));
    });
    return unsubscribe;
  }, []);

  // Build available subFilters dynamically
  const getSubFilters = useMemo(() => {
    const today = moment();

    if (duration === "weekly") {
      const start = today.clone().startOf("month");
      const totalWeeks = Math.ceil((today.date() + start.day()) / 7);
      return Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`);
    }

    if (duration === "monthly") {
      return moment.monthsShort().slice(0, today.month() + 1);
    }

    if (duration === "yearly") {
      const currentYear = today.year();
      return [currentYear.toString(), (currentYear - 1).toString()];
    }

    return [];
  }, [duration]);

  // Update subFilter when duration changes
 // Update subFilter when duration changes
useEffect(() => {
  if (duration !== "Custom" && getSubFilters.length > 0) {
    if (duration === "monthly") {
      // Select current month
      const currentMonthShort = moment().format("MMM"); // e.g., "Oct"
      setSubFilter(currentMonthShort);
    } else {
      // For weekly/yearly, select first available filter
      setSubFilter(getSubFilters[0]);
    }
  }
}, [duration, getSubFilters]);


  // Compute chart data dynamically
  const chartData = useMemo(() => {
    if (duration === "weekly") {
      const weekNumber = parseInt(subFilter.replace("Week ", ""), 10);
      return getWeeklyDataByCurrentMonth(orders, weekNumber);
    }
    if (duration === "monthly") {
      const monthIndex: number = moment(subFilter, "MMM").month();
      const year: number = moment().year();
      return getMonthlyData(orders, monthIndex + 1, year);
    }
    if (duration === "yearly") {
      return getYearlyData(orders, parseInt(subFilter, 10));
    }
    if (duration === "Custom") {
      return getCustomData(orders, customWeek, customMonth, customYear);
    }
    return { labels: [], sales: [], revenue: [] };
  }, [duration, subFilter, orders, customWeek, customMonth, customYear]);

  return {
    duration,
    setDuration,
    subFilter,
    setSubFilter,
    customWeek,
    setCustomWeek,
    customMonth,
    setCustomMonth,
    customYear,
    setCustomYear,
    getSubFilters,
    chartData,
  };
};
