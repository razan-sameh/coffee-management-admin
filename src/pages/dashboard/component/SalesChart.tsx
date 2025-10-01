/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Stack,
  Typography,
  useTheme,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import moment from "moment";
import { useSalesChart } from "../../../hook/useSalesChart";

const SalesChart = () => {
  const theme = useTheme();
  const {
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
  } = useSalesChart();

  const { labels, sales, revenue } = chartData;

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Sales Overview</Typography>
      <Typography variant="h4" fontWeight="bold">
        ${revenue.reduce((a, b) => a + b, 0).toLocaleString()}
      </Typography>

      {/* Controls */}
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <Stack direction="column" spacing={1} alignItems="flex-end">
          <ButtonGroup variant="outlined">
            {["weekly", "monthly", "yearly", "Custom"].map((d) => (
              <Button
                key={d}
                onClick={() => setDuration(d as any)}
                sx={{
                  backgroundColor:
                    duration === d ? theme.palette.secondary.main : undefined,
                  color: duration === d ? "white" : undefined,
                }}
              >
                {d}
              </Button>
            ))}
          </ButtonGroup>

          {/* SubFilter (only for weekly/monthly/yearly) */}
          {duration !== "Custom" && (
            <Select
              value={subFilter}
              onChange={(e) => setSubFilter(e.target.value)}
              size="small"
              sx={{ maxWidth: 200 }}
            >
              {getSubFilters.map((filter) => (
                <MenuItem key={filter} value={filter}>
                  {filter}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Custom filter controls */}
          {duration === "Custom" && (
            <Stack direction="row" spacing={1}>
              <Select
                value={customWeek}
                onChange={(e) => setCustomWeek(Number(e.target.value))}
                size="small"
              >
                {[1, 2, 3, 4, 5].map((w) => (
                  <MenuItem key={w} value={w}>
                    Week {w}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={customMonth}
                onChange={(e) => setCustomMonth(Number(e.target.value))}
                size="small"
              >
                {moment.monthsShort().map((m, i) => (
                  <MenuItem key={m} value={i + 1}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                size="small"
              >
                {[moment().year(), moment().year() - 1, moment().year() - 2].map(
                  (y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  )
                )}
              </Select>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* Chart */}
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: labels,
          },
        ]}
        yAxis={[
          {
            min: 0,
            valueFormatter: (value: any) => `$${value}`,
          },
        ]}
        series={[
          { data: sales, label: "Sales" },
          { data: revenue, label: "Revenue" },
        ]}
        height={400}
        colors={[theme.palette.secondary.main, theme.palette.primary.main]}
        slotProps={{
          legend: {
            position: { horizontal: "start" },
            direction: "horizontal",
          },
        }}
      />
    </Stack>
  );
};

export default SalesChart;
