import { get, off, onValue, ref } from "firebase/database";
import type { typCart, typCategory, typProduct, typUser } from "../content/types";
import { database } from "../services/configuration";
import type { enmSize } from "../content/enums";

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
    const productRef = ref(database, `/product/${id}`);
    const snapshot = await get(productRef);
    return snapshot.exists() ? snapshot.val() as typProduct : null;
};


export const listenToCart = (
    uid: string,
    callback: (items: typCart[]) => void
): () => void => {
    const cartRef = ref(database, `cart/${uid}`);
    const listener = onValue(cartRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const items = Object.values(data) as typCart[];
            callback(items);
        } else {
            console.log("No cart items found for user:", uid);
            callback([]);
        }
    }, (error) => {
        console.error("Error listening to cart:", error);
    });

    return () => off(cartRef, 'value', listener);
};;

export const getMultipleProducts = async (
    ids: string[]
): Promise<Record<string, typProduct>> => {
    const products: Record<string, typProduct> = {};
    await Promise.all(
        ids.map(async (id) => {
            const snap = await get(ref(database, `product/${id}`));
            if (snap.exists()) {
                products[id] = snap.val() as typProduct;
            }
        })
    );
    return products;
};


export const getCartItem = async (
    uid: string,
    productID: string,
    size: enmSize
): Promise<typCart | null> => {
    const itemKey = `${uid}_${productID}_${size}`;
    const itemRef = ref(database, `cart/${uid}/${itemKey}`);
    const snapshot = await get(itemRef);
    return snapshot.exists() ? (snapshot.val() as typCart) : null;
};