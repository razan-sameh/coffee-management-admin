import { Typography } from "@mui/material";

export default function CartTotal({
  total,
  isDelivery,
}: {
  total: number;
  isDelivery: boolean;
}) {
  const deliveryPrice = 5;

  return (
    <>
      {isDelivery && <Typography>SubTotal: ${total.toFixed(2)}</Typography>}
      {isDelivery && <Typography>Delivery: ${deliveryPrice}</Typography>}
      <Typography fontWeight="bold" mt={1}>
        Total: ${Number((total + deliveryPrice).toFixed(2))}
      </Typography>
    </>
  );
}
