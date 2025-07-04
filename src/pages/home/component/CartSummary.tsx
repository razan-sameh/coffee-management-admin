import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  TextField,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ref, onValue, remove, get } from 'firebase/database';

import { database } from '../../../services/configuration';
import type { typCart, typProduct } from '../../../content/types';
import type { RootState } from '../../../redux/store';

export default function CartSummary() {
  const theme = useTheme();
  const uid = useSelector((state: RootState) => state.auth.user?.Uid);
  const [cartItems, setCartItems] = useState<typCart[]>([]);
  const [products, setProducts] = useState<Record<number, typProduct>>({});

  const [orderType, setOrderType] = useState<'In Place' | 'take-away'>('In Place');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // 🔁 Load cart
  useEffect(() => {
    if (!uid) return;
    const cartRef = ref(database, `cart/${uid}`);

    const unsubscribe = onValue(cartRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) return setCartItems([]);

      const items = Object.values(data) as typCart[];
      setCartItems(items);

      // Get unique product IDs
      const productIds = [...new Set(items.map((item) => item.productID))];

      // Fetch all products in parallel
      const productData: Record<number, typProduct> = {};
      await Promise.all(
        productIds.map(async (id) => {
          const snap = await get(ref(database, `product/${id}`));
          if (snap.exists()) productData[id] = snap.val();
        })
      );
      setProducts(productData);
    });

    return () => unsubscribe();
  }, [uid]);

  // 🗑️ Delete
  const handleDeleteItem = (productID: number, size: string) => {
    const itemKey = `${uid}_${productID}_${size}`;
    const itemRef = ref(database, `cart/${uid}/${itemKey}`);
    remove(itemRef);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleConfirm = () => {
    if (orderType === 'take-away' && (!name || !phone || !address)) {
      alert('Please fill in all customer info.');
      return;
    }

  };

  return (
    <Box
      sx={{
        p: 2,
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box display="flex" alignItems="center">
        <ShoppingCartIcon />
        <Typography variant="title" sx={{ ml: 1 }}>
          My Cart
        </Typography>
      </Box>

      {/* Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={orderType === 'take-away'}
            onChange={() =>
              setOrderType(orderType === 'In Place' ? 'take-away' : 'In Place')
            }
          />
        }
        label={orderType === 'take-away' ? 'Take Away' : 'In Place'}
        sx={{ mt: 2 }}
      />

      {/* Cart Items */}
      {cartItems.map((item) => {
        const product = products[item.productID];
        const image = product?.image?.[0] ?? '';
        const title = product?.title ?? `Product #${item.productID}`;
        const itemKey = `${item.Uid}_${item.productID}_${item.size}`;

        return (
          <Box
            key={itemKey}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={image} variant="rounded" sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography fontWeight="bold">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {item.size} | Qty: {item.count}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>${item.price.toFixed(2)}</Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteItem(item.productID, item.size)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}

      <Divider sx={{ my: 2 }} />
      <Typography fontWeight="bold">Total: ${total.toFixed(2)}</Typography>

      {/* Extra fields for Take Away */}
      {orderType === 'take-away' && (
        <>
          <TextField
            fullWidth
            label="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            multiline
            rows={2}
            sx={{ mt: 2 }}
          />
        </>
      )}

      {/* ✅ Payment Method (always visible) */}
      <FormControl sx={{ mt: 2 }}>
        <FormLabel>Payment Method</FormLabel>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
        >
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
        </RadioGroup>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleConfirm}
      >
        Confirm Order
      </Button>
    </Box>
  );
}
