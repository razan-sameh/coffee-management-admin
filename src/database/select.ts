import { get, off, onValue, ref } from "firebase/database";
import type { typCategory, typProduct, typUser } from "../content/types";
import { database } from "../services/configuration";

export const getUserInfo = (
    Uid: string,
    callback: (data: typUser) => void
): () => void => {
    const userRef = ref(database, `/user/${Uid}`);
    const listener = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) callback(data as typUser);
    });
    // Returns unsubscribe function to detach listener
    return () => off(userRef, 'value', listener);
};

export const getAllUsers = (
    callback: (users: Record<string, typUser>) => void
): () => void => {
    const usersRef = ref(database, "/user");
    const listener = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) callback(data as Record<string, typUser>);
    });

    // Returns unsubscribe function
    return () => off(usersRef, "value", listener);
};

export const getAllCategories = (
    callback: (users: Record<string, typCategory>) => void
): () => void => {
    const usersRef = ref(database, "/category");
    const listener = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) callback(data as Record<string, typCategory>);
    });

    // Returns unsubscribe function
    return () => off(usersRef, "value", listener);
};

export const getCategoryById = async (id: number | string): Promise<typCategory | null> => {
    const categoryRef = ref(database, `/category`);
    const snapshot = await get(categoryRef);

    if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, typCategory>;
        const found = Object.values(data).find((cat) => +cat.ID === +id);
        return found ?? null;
    }
    return null;
};

export const getAllProducts = (
    callback: (users: Record<string, typProduct>) => void
): () => void => {
    const usersRef = ref(database, "/product");
    const listener = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) callback(data as Record<string, typProduct>);
    });

    // Returns unsubscribe function
    return () => off(usersRef, "value", listener);
};


export const getProductById = async (id: string): Promise<typProduct | null> => {
    const productRef = ref(database, `/product/${id}`); // ✅ Access directly by key
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
        return snapshot.val() as typProduct;
    }

    return null;
};