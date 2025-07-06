/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Divider,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import {
  clearCart as clearCartRedux,
  removeFromCart as removeFromCartRedux,
  setCart,
} from '../../../../redux/slices/cartSlice';
import {
  listenToCart,
  getMultipleProducts,
} from '../../../../database/select';
import {
  deleteCartItem,
  clearCart as clearCartDB,
} from '../../../../database/delete';
import { createOrder } from '../../../../database/insert';
import {
  enmOrderType,
  enmPaymentMethod,
  enmSize,
  enmToastSeverity,
} from '../../../../content/enums';
import { setToast } from '../../../../redux/slices/toastSlice';
import CartHeader from './component/CartHeader';
import CartItem from './component/CartItem';
import CartTotal from './component/CartTotal';
import DeliveryForm from './component/DeliveryForm';
import PaymentMethodSelector from './component/PaymentMethodSelector';
import type { RootState } from '../../../../redux/store';
import type { typProduct } from '../../../../content/types';

interface DeliveryFormInputs {
  name: string;
  phone: string;
  address: string;
}

export default function CartSummary() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const uid = useSelector((state: RootState) => state.auth.user?.Uid);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [products, setProducts] = useState<Record<string, typProduct>>({});
  const [orderType, setOrderType] = useState<enmOrderType>(
    enmOrderType.dineIn
  );
  const [paymentMethod, setPaymentMethod] = useState<enmPaymentMethod>(
    enmPaymentMethod.cash
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryFormInputs>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = listenToCart(uid, async (items) => {
      dispatch(setCart(items));
      const productIds = [...new Set(items.map((item) => item.productID))];
      const productData = await getMultipleProducts(productIds);
      setProducts(productData);
    });

    return () => unsubscribe();
  }, [uid]);

  // ✅ useMemo to optimize product lookup
  const productMap = useMemo(() => {
    const map: Record<string, typProduct> = {};
    cartItems.forEach((item) => {
      const product = products[item.productID];
      if (product) map[item.productID] = product;
    });
    return map;
  }, [cartItems, products]);

  const handleDeleteItem = (productID: string, size: enmSize) => {
    if (!uid) return;
    deleteCartItem(uid, productID, size);
    dispatch(removeFromCartRedux({ productID, size }));
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems]
  );

  const onSubmit = async (data: DeliveryFormInputs) => {
    if (!uid) return;

    if (cartItems.length === 0) {
      dispatch(
        setToast({
          message: 'Cart is empty.',
          severity: enmToastSeverity.warning,
        })
      );
      return;
    }

    const isDelivery = orderType === enmOrderType.delivery;

    if (isDelivery) {
      const hasErrors =
        !data.name?.trim() || !data.phone?.trim() || !data.address?.trim();

      if (hasErrors) {
        dispatch(
          setToast({
            message: 'Please fill in all delivery fields correctly.',
            severity: enmToastSeverity.warning,
          })
        );
        return;
      }
    }

    const deliveryInfo = isDelivery ? data : null;

    try {
      await createOrder({
        userId: uid,
        cartItems,
        total,
        paymentMethod,
        orderType,
        deliveryInfo,
      });

      await clearCartDB(uid);
      dispatch(clearCartRedux());
      reset();

      dispatch(
        setToast({
          message: 'Order placed successfully',
          severity: enmToastSeverity.success,
        })
      );
    } catch (err) {
      dispatch(
        setToast({
          message: `Failed to place order: ${err}`,
          severity: enmToastSeverity.error,
        })
      );
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
      <CartHeader />

      <FormControlLabel
        control={
          <Switch
            checked={orderType === enmOrderType.delivery}
            onChange={() =>
              setOrderType(
                orderType === enmOrderType.dineIn
                  ? enmOrderType.delivery
                  : enmOrderType.dineIn
              )
            }
          />
        }
        label={orderType}
        sx={{ mt: 2 }}
      />

      {cartItems.map((item) => (
        <CartItem
          key={`${item.Uid}_${item.productID}_${item.size}`}
          item={item}
          product={productMap[item.productID]}
          onDelete={() => handleDeleteItem(item.productID, item.size)}
        />
      ))}

      <Divider sx={{ my: 2 }} />
      <CartTotal total={total} />

      {orderType === enmOrderType.delivery && (
        <DeliveryForm register={register} errors={errors} />
      )}

      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit(onSubmit)}
      >
        Confirm Order
      </Button>
    </Box>
  );
}
