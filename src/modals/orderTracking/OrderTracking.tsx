import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { enmOrderStatus } from "../../content/enums";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getOrderById } from "../../database/select";
import { useState, useEffect } from "react";
import type { typOrder } from "../../content/types";
// Example order

const statusPhrases: Record<
  enmOrderStatus,
  { done: string; active: string; pending: string }
> = {
  [enmOrderStatus.Placed]: {
    done: "Your order has been placed successfully",
    active: "We are placing your order...",
    pending: "Waiting to place your order.",
  },
  [enmOrderStatus.Brewing]: {
    done: "Your coffee has finished brewing",
    active: "Your coffee is brewing right now",
    pending: "Coffee brewing will start soon.",
  },
  [enmOrderStatus.Ready]: {
    done: "Your order is ready to be picked up",
    active: "Preparing your order and getting it ready...",
    pending: "Order will be ready after brewing.",
  },
  [enmOrderStatus.OutForDelivery]: {
    done: "Your order has already been delivered",
    active: "Your order is out for delivery",
    pending: "Order will go out for delivery soon.",
  },
  [enmOrderStatus.Delivered]: {
    done: "Enjoy your coffee It’s been delivered!",
    active: "Finalizing delivery...",
    pending: "Delivery will happen soon.",
  },
};
interface OrderTrackingProps {
  orderId: string;
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const theme = useTheme();
  const [order, setOrder] = useState<typOrder | null>(null);
  const [loading, setLoading] = useState(true);
  // Dynamic flow depending on order type
  const orderFlow =
    order?.orderType?.toLowerCase() === "delivery"
      ? [
          enmOrderStatus.Placed,
          enmOrderStatus.Brewing,
          enmOrderStatus.Ready,
          enmOrderStatus.OutForDelivery,
          enmOrderStatus.Delivered,
        ]
      : [enmOrderStatus.Placed, enmOrderStatus.Brewing, enmOrderStatus.Ready];
  const currentIndex = order?.status ? orderFlow.indexOf(order.status) : -1;

  enum enmStatus {
    done = "done",
    active = "active",
    pending = "pending",
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      setLoading(true);
      const fetchedOrder = await getOrderById(orderId);

      if (!fetchedOrder) {
        setOrder(null);
      } else {
        setOrder(fetchedOrder); // ✅ You forgot this line
      }

      setLoading(false);
    };
    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // Order not found state
  if (!order) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        flexDirection="column"
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Order Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We couldn’t find an order with ID <b>{orderId}</b>.
        </Typography>
      </Box>
    );
  }

  return (
    // Parent fills height
    <Box
      display="flex"
      gap={4}
      height="100%"
      bgcolor={theme.palette.background.default}
    >
      {/* Left side - Tracking Steps */}
      <Box flex={2} p={4}>
        <Typography variant="h3" fontWeight="400" gutterBottom>
          Track Order
        </Typography>

        {orderFlow.map((step, i) => {
          const isLastStep = i === orderFlow.length - 1;

          const status: enmStatus =
            i < currentIndex
              ? enmStatus.done
              : i === currentIndex
              ? isLastStep
                ? enmStatus.done
                : enmStatus.active
              : enmStatus.pending;

          const phrase = statusPhrases[step][status];

          return (
            <Box key={i} display="flex" alignItems="center" my={8}>
              <CheckCircleIcon
                sx={{
                  color:
                    status === enmStatus.done
                      ? theme.palette.success.main
                      : status === enmStatus.active
                      ? theme.palette.warning.main
                      : "rgba(0, 0, 0, 0.2)",
                  marginRight: 1.5,
                  fontSize: 32,
                }}
              />
              <Typography variant="body1">{phrase}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Right side - Order Summary */}
      <Box
        flex={1}
        bgcolor={theme.palette.background.paper}
        p={6}
        display="flex"
        flexDirection="column"
        height="100%" // ✅ take full height
      >
        <Typography variant="h4" fontWeight="400" gutterBottom>
          Order Summary
        </Typography>

        <Box mb={3} mt={4}>
          <Typography variant="body2" color="text.secondary">
            Transaction Date
          </Typography>
          <Typography>{order?.date}</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            Payment Method
          </Typography>
          <Typography>{order?.paymentMethod}</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            Order Type
          </Typography>
          <Typography>{order?.orderType}</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            Platform
          </Typography>
          <Typography>{order?.platform}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Order Total
          </Typography>
          <Typography fontWeight={700} variant="h6">
            ${order?.total}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
