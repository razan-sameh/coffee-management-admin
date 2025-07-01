import { ref, remove } from "firebase/database";
import { deleteUserRequest } from "../services/requests";
import { database } from "../services/configuration";

export const deleteUserByUid = async (id: string | number): Promise<void> => {
    try {
        const uid = String(id); // Ensure it's a string for Firebase path
        await deleteUserRequest(uid); // Send request to auth service or backend
        const userRef = ref(database, `user/${uid}`);
        await remove(userRef);
        console.log(`Deleted user with UID: ${uid}`);
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
        console.log(`Deleted category with ID: ${idStr}`);
    } catch (error) {
        console.error("Failed to delete category:", error);
        throw error;
    }
};
