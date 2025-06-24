import { off, onValue, ref } from "firebase/database";
import type { typUser } from "../content/types";
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