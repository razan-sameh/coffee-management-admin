import { ref, remove } from "firebase/database";
import { deleteUserRequest } from "../services/requests";
import { database } from "../services/configuration";

export const deleteUserByUid = async (id: string | number): Promise<void> => {
    try {
        const uid = String(id); // Ensure it's a string for Firebase path
        await deleteUserRequest(uid); // Send request to auth service or backend
        // const userRef = ref(database, `user/${uid}`);
        // await remove(userRef);
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
};

export const deleteCategoryById = async (id: string | number): Promise<void> => {
    try {
        const idStr = String(id); // Convert to string if it's a number
        const categoryRef = ref(database, `category/${idStr}`);
        await remove(categoryRef);
    } catch (error) {
        console.error("Failed to delete category:", error);
        throw error;
    }
};

export const deleteProductById = async (id: string | number): Promise<void> => {
    try {
        const idStr = String(id); // Ensure the ID is a string
        const productRef = ref(database, `product/${idStr}`);
        await remove(productRef);
    } catch (error) {
        console.error("Failed to delete product:", error);
        throw error;
    }
};

export const deleteCartItem = async (
    uid: string,
    productID: string,
    size: string
): Promise<void> => {
    const itemKey = `${uid}_${productID}_${size}`;
    const itemRef = ref(database, `cart/${uid}/${itemKey}`);
    await remove(itemRef);
};

export const clearCart = async (Uid: string): Promise<void> => {
    const cartRef = ref(database, `cart/${Uid}`);
    await remove(cartRef);
};