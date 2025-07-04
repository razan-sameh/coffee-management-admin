import { get, push, ref, set } from 'firebase/database';
import type { typProduct, typUser } from '../content/types';
import { database } from '../services/configuration'; // adjust the path
import { getProductById } from './select';
import type { enmSize } from '../content/enums';
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

export const addItemInCart = async (
    Uid: string,
    productID: string,
    size: enmSize,
    count: number = 1
): Promise<void> => {
    const userCartRef = ref(database, `cart/${Uid}`);
    const itemKey = `${Uid}_${productID}_${size}`;

    const snapshot = await get(userCartRef);
    const cartItems = snapshot.val() || {};

    const product = await getProductById(productID);
    if (!product) throw new Error('Product not found');

    if (cartItems[itemKey]) {
        cartItems[itemKey].count += count;
        cartItems[itemKey].price = product.price * cartItems[itemKey].count;
    } else {
        cartItems[itemKey] = {
            Uid,
            productID,
            size,
            count,
            price: product.price * count,
        };
    }

    await set(userCartRef, cartItems);
    console.log('✅ Cart updated successfully');
};