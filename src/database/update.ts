import { ref, set, update } from "firebase/database";
import { database } from "../services/configuration";
import type { typProduct, typUser } from "../content/types";

export const updateUserInfo = (
    Uid: string | number,
    updatedData: Partial<typUser>
): Promise<void> => {
    const userRef = ref(database, `/user/${Uid}`);
    return update(userRef, updatedData);
};
export const updateCategoryTitle = (
    id: string | number,
    payload: Partial<{ title: string }>
): Promise<void> => {
    const categoryRef = ref(database, `/category/${id}`);
    return update(categoryRef, payload);
};

// in select.ts or another database file
export const updateProduct = async (product: typProduct): Promise<void> => {
    const productRef = ref(database, `product/${product.ID}`);
    await set(productRef, product);
};

