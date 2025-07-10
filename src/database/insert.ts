import { get, push, ref, set } from 'firebase/database';
import type { typOrder, typProduct, typUser } from '../content/types';
import { database } from '../services/configuration'; // adjust the path
import { getProductById } from './select';
import { enmAddToCartMode, enmPlatform, type enmSize } from '../content/enums';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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

export const addItemToCart = async (
    uid: string,
    productID: string,
    size: enmSize,
    count: number = 1,
    mode: enmAddToCartMode = enmAddToCartMode.increment // new param
): Promise<void> => {
    const userCartRef = ref(database, `cart/${uid}`);
    const itemKey = `${uid}_${productID}_${size}`;

    const snapshot = await get(userCartRef);
    const cartItems = snapshot.val() || {};

    const product = await getProductById(productID);
    if (!product) throw new Error('Product not found');

    if (cartItems[itemKey]) {
        const newCount = mode === enmAddToCartMode.increment ? cartItems[itemKey].count + count : count;
        cartItems[itemKey].count = newCount;
        cartItems[itemKey].price = product.price * newCount;
    } else {
        cartItems[itemKey] = {
            Uid: uid,
            productID,
            size,
            count,
            price: product.price * count,
        };
    }

    await set(userCartRef, cartItems);
};

export const createOrder = async (order: Omit<typOrder, 'id' | 'date' | 'platform'>): Promise<string> => {
    const orderId = uuidv4();

    const orderData: typOrder = {
        id: orderId,
        date: moment().format('YYYY-MM-DD HH:mm'),
        platform: enmPlatform.web,
        ...order
    };

    const orderRef = ref(database, `order/${orderId}`);
    await set(orderRef, orderData);

    return orderId;
};