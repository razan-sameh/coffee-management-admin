import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TrackOrder = () => {
  return (
    <Card
      sx={{
        bgcolor: '#f9c06a5c',
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default TrackOrder;
