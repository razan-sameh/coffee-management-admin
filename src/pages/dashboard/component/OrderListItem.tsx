import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Box,
  useTheme,
} from "@mui/material";
import type { typOrder } from "../../../content/types";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router";

interface OrderListItemProps {
  order: typOrder;
}
const OrderListItem = ({ order }: OrderListItemProps) => {
  const navigate = useNavigate();
    const theme = useTheme()

  return (
    <Card sx={{ boxShadow: 1 ,backgroundColor: theme.palette.background.default}} >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* <Avatar src={order.avatar} sx={{ width: 40, height: 40 }} /> */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {order.id}
              </Typography>
              <Typography variant="caption" color='primary'>
                {order.items.length} Items
              </Typography>
            </Box>
          </Stack>
          <IconButton
            size="small"
            // sx={{ bgcolor: "white" }}
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Typography variant="body2" fontWeight="bold">
            ${order.total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • {order.date}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderListItem;
