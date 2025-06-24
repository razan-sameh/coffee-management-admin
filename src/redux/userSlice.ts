// authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { typUser } from '../content/types';
import { enmRole } from '../content/enums';

const initialState: typUser = {
    Uid: '',
    firstName: '',
    lastName:'',
    email:'',
    phoneNumber: '',
    address: '',
    password:'',
    role:enmRole.user,
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<typUser>) {
            state.Uid = action.payload.Uid;
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.password = action.payload.password;
            state.role = action.payload.role;
        },
        clearUser(state) {
            state.Uid = '';
            state.email = '';
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.phoneNumber = '';
            state.password = '';
            state.role = enmRole.user       
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
