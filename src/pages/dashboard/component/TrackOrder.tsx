import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import OrderTracking from "../../../modals/orderTracking/OrderTracking";
import SideModal from "../../../components/SideModal";

const TrackOrder = () => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const handleSearch = () => {
    if (orderId.trim()) {
      setOpen(true);
    }
  };
  return (
    <>
      {/* Search Card */}
      <Card
        sx={{
          bgcolor: "#f9c06a5c",
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Track Order
          </Typography>
          <Typography variant="body2" mb={2}>
            Type your order id and find the order
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter order id"
            value={orderId} // ✅ controlled input
            onChange={(e) => setOrderId(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Reusable Side Modal */}
      <SideModal open={open} onClose={() => setOpen(false)} width="90%">
        <OrderTracking orderId={orderId} />
      </SideModal>
    </>
  );
};

export default TrackOrder;
