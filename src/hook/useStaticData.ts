import { useEffect, useState } from 'react';
import type { typUser, typProduct, typCategory } from '../content/types';
import { getAllUsers, getAllProducts, getAllCategories } from '../database/select';


export const useStaticData = () => {
    const [users, setUsers] = useState<Record<string, typUser>>({});
    const [products, setProducts] = useState<Record<string, typProduct>>({});
    const [categories, setCategories] = useState<Record<string, typCategory>>({});

    useEffect(() => {
        const unsubscribeUsers = getAllUsers(setUsers);
        const unsubscribeProducts = getAllProducts(setProducts);
        const unsubscribeCategories = getAllCategories(setCategories);

        return () => {
            unsubscribeUsers();
            unsubscribeProducts();
            unsubscribeCategories();
        };
    }, []);

    return { users, products, categories };
};
