import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

import OrderListItem from "./OrderListItem";
import type { typOrder } from "../../../content/types";
import { getTodayOrders } from "../../../database/select";

const NewOrderList = () => {
  const [orders, setOrders] = useState<typOrder[]>([]);

  useEffect(() => {
    const unsubscribe = getTodayOrders((data) => {
      setOrders(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Typography variant="h6" fontWeight="bold">
            New Order
          </Typography>
          <Box
            sx={{
              bgcolor: "#FFA726",
              color: "white",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {orders.length}
          </Box>
        </Stack>

        <Stack spacing={2}>
          {orders.map((order) => (
            <OrderListItem
              key={order.id}
              order={order}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NewOrderList;
