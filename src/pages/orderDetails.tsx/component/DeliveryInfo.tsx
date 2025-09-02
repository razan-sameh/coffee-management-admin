import { Grid, Typography, Stack } from "@mui/material";
import type { typOrder } from "../../../content/types";

export const DeliveryInfo = ({ info }: { info: typOrder["deliveryInfo"] }) => (
  <Grid size={12}>
    <Typography variant="body2" color="textSecondary" mb={1}>
      Delivery Info
    </Typography>
    <Stack spacing={0.5}>
      <Typography>
        <strong>Name:</strong> {info?.name}
      </Typography>
      <Typography>
        <strong>Phone:</strong>{" "}
        {`${info?.phone.countryCode} ${info?.phone.number}`}
      </Typography>
      <Typography>
        <strong>Address:</strong> {info?.address?.address?.house_number},{" "}
        {info?.address?.address?.road}, {info?.address?.address?.city},{" "}
        {info?.address?.address?.country}
      </Typography>
    </Stack>
  </Grid>
);
