import { Box, Typography, Grid, Stack } from "@mui/material";
import NewOrderList from "./component/NewOrderList";
import SalesChart from "./component/SalesChart";
import StatsGrid from "./component/StatsGrid";
import TopSellingProducts from "./component/TopSellingProducts";

const Dashboard = () => {
  return (
    <Box>
      {/* Breadcrumb */}
      <Typography variant="title" fontSize={30} fontWeight="bold">
        Dashboard
      </Typography>

      <Grid spacing={3} mt={2}>
        <StatsGrid />
        <Grid container spacing={3} mt={4}>
          {/* Left Column - Track Order & New Orders */}
          <Grid size={{ xs: 12, md: 4 }}>
            <NewOrderList />
          </Grid>

          {/* Right Column - Stats */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <SalesChart />
              <TopSellingProducts />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
