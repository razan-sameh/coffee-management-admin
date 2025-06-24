import { ref, set } from 'firebase/database';
import type { typUser } from '../content/types';
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