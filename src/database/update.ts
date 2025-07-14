/* eslint-disable @typescript-eslint/no-unused-vars */
import { get, ref, set, update } from "firebase/database";
import { database } from "../services/configuration";
import type { typProduct, typUser } from "../content/types";
import { ChangeUserSatutsRequest } from "../services/requests";

export const updateUserInfo = async (
    Uid: string | number,
    updatedData: Partial<typUser>
): Promise<void> => {
    const userRef = ref(database, `/user/${Uid}`);

    //  Step 1: Fetch current data to compare
    const snapshot = await get(userRef);
    const existingData = snapshot.val() as typUser | null;

    if (!existingData) throw new Error("User not found");

    //  Step 2: Normalize address if needed
    if (updatedData.address === undefined) {
        updatedData.address = [];
    }

    //  Step 3: Clean undefined
    const cleanData = Object.fromEntries(
        Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    //  Step 4: Update Realtime Database
    await update(userRef, cleanData);

    //  Step 5: If isActive changed → update Firebase Auth disabled status
    if (
        Object.prototype.hasOwnProperty.call(updatedData, "isActive") &&
        updatedData.isActive !== existingData.isActive
    ) {
        // 👇 Call your Express backend
        await ChangeUserSatutsRequest(Uid, updatedData.isActive!)
    }
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

