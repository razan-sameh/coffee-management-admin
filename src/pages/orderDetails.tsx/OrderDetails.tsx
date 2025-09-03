import { useEffect, useState } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { useParams } from 'react-router';
import type { typOrder, typProduct, typUser } from '../../content/types';
import { getOrderById, getMultipleProducts, getUserById } from '../../database/select';
import { DeliveryInfo } from './component/DeliveryInfo';
import { OrderInfoSection } from './component/OrderInfoSection ';
import { OrderItemCard } from './component/OrderItemCard';
import { OrderSummary } from './component/OrderSummary';


export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<typOrder | null>(null);
  const [products, setProducts] = useState<Record<string, typProduct>>({});
  const [user, setUser] = useState<typUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      const fetchedOrder = await getOrderById(id);
      if (!fetchedOrder) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const productIDs = fetchedOrder.items.map((item) => item.productID);
      const fetchedProducts = await getMultipleProducts(productIDs);
      const fetchedUser = await getUserById(fetchedOrder.userId);

      setOrder(fetchedOrder);
      setProducts(fetchedProducts);
      setUser(fetchedUser);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>Order Details</Typography>

      <OrderInfoSection order={order} user={user} />

      {order.deliveryInfo && <DeliveryInfo info={order.deliveryInfo} />}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Your Order</Typography>

      {order.items.map((item, idx) => (
        <OrderItemCard key={idx} item={item} product={products[item.productID]} />
      ))}

      <OrderSummary order={order} />
    </Box>
  );
}
