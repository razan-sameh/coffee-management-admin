import { Grid, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import StatCard from "./StatCard";
import TrackOrder from "./TrackOrder";
import {
  getNewOrders,
  getProcessedOrders,
  getShippedOrders,
  getNewCustomersThisMonth,
} from "../../../content/utils";
import { useDashboardData } from "../../../hook/useDashboardData";

const StatsGrid = () => {
  const theme = useTheme();
  const { orders, users, loading } = useDashboardData();

  if (loading) return <p>Loading...</p>;

  const newOrders = getNewOrders(orders);
  const processedOrders = getProcessedOrders(orders);
  const shippedOrders = getShippedOrders(orders);
  const newCustomers = getNewCustomersThisMonth(users);
  const newCustomersTrend = newCustomers.trend > 0 ? 'Growth' : 'Decline '
  return (
    <Grid container spacing={2}>
      {/* Track Order */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <TrackOrder />
      </Grid>

      {/* New Order */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <StatCard
          icon={ShoppingCartIcon}
          title="New Order"
          value={newOrders.count.toString()}
          change={`+ $${newOrders.total.toLocaleString()}`}
          bgcolor={theme.palette.background.paper}
          iconColor="success"
        />
      </Grid>

      {/* Order Processed */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <StatCard
          icon={CheckCircleIcon}
          title="Order Processed"
          value={processedOrders.count.toString()}
          change={`+ $${processedOrders.total.toLocaleString()}`}
          bgcolor="rgba(0, 0, 0, 0.12)"
          iconColor="warning"
        />
      </Grid>

      {/* Order Shipped */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <StatCard
          icon={LocalShippingIcon}
          title="Order Shipped"
          value={shippedOrders.count.toString()}
          change={`+ $${shippedOrders.total.toLocaleString()}`}
          bgcolor={theme.palette.primary.main}
          iconColor="primary"
        />
      </Grid>

      {/* New Customers */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={GroupIcon}
          title="New Customers This Month"
          value={newCustomers.count.toString()}
          change={`${newCustomersTrend} ${newCustomers.growth}`}
          bgcolor="rgba(0, 0, 0, 0.12)"
          iconColor="primary"
        />
      </Grid>
    </Grid>
  );
};

export default StatsGrid;
