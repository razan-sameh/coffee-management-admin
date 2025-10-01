import { useState, useEffect } from "react"; 
import type { typOrder, typUser, typProduct } from "../content/types";
import { getAllOrders, getAllUsers, getAllProducts } from "../database/select";

export function useDashboardData() {
  const [orders, setOrders] = useState<typOrder[]>([]);
  const [users, setUsers] = useState<typUser[]>([]);
  const [products, setProducts] = useState<typProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeOrders = getAllOrders((data) => {
      setOrders(Object.values(data));
      setLoading(false);
    });

    const unsubscribeUsers = getAllUsers((data) => {
      setUsers(Object.values(data));
      setLoading(false);
    });

    const unsubscribeProducts = getAllProducts((data) => {
      setProducts(Object.values(data));
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeProducts();
    };
  }, []);

  return { orders, users, products, loading };
}
