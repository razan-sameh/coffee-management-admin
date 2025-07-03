import { push, ref, set } from 'firebase/database';
import type { typProduct, typUser } from '../content/types';
import { database } from '../services/configuration'; // adjust the path
export const insertUser = (user: typUser) => {
    set(ref(database, `/user/${user.Uid}`), {
        Uid: user.Uid ?? '',
        name: user.firstName + ' ' + user.lastName,
        email: user.email ?? '',
        password: user.password ?? '',
        role: user.role ?? '',
        phoneNumber: [user.phoneNumber]
    })
        .then(() => console.log('User data inserted successfully'))
        .catch(error => console.error('Error inserting user data:', error));
};

export async function insertProduct(product: typProduct) {
    const productRef = ref(database, 'product');
    const newRef = push(productRef); // generates a new unique key

    const newProduct = {
        ...product,
        ID: newRef.key // optionally store the ID
    };

    await set(newRef, newProduct);
}
