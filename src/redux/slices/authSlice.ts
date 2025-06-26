// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app, { faceBookprovider, googleProvider } from '../../services/configuration';
import { insertUser } from '../../database/insert';
import type { typUser } from '../../content/types';
import { enmRole, enmToastSeverity } from '../../content/enums';
import { getUserInfo } from '../../database/select';
import { setToast } from './toastSlice';

interface AuthState {
    user: typUser | null;
    loading: boolean;
    isAuthorized: boolean;
    error: string | null;
}
const initialState: AuthState = {
    user: null,
    loading: false,
    isAuthorized: false,
    error: null,
};
interface ISignupFormInput {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    role: { label: string; value: string }
}
const auth = getAuth(app);

//initializeAuth
export const initializeAuth = createAsyncThunk(
    'auth/initializeAuth',
    async () => {
        return new Promise<typUser | null>((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    getUserInfo(user.uid, (userData: typUser) => {
                        unsubscribe(); // stop listening to auth
                        resolve(userData);
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }
);

// Sign up
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (formData: ISignupFormInput, { rejectWithValue, dispatch }) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user: typUser = {
                Uid: res.user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
                role: formData.role,
            };
            insertUser(user);
            return user;
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                dispatch(setToast({
                    message: 'That email address is already in use!',
                    severity: enmToastSeverity.error,
                }));
            } else if (error.code === 'auth/invalid-email') {
                dispatch(setToast({
                    message: 'That email address is invalid!',
                    severity: enmToastSeverity.error,
                }));
            } else {
                dispatch(setToast({
                    message: `Authentication failed: ${error.message}`,
                    severity: enmToastSeverity.error,
                }));
            } return rejectWithValue(error.code);
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (formData: { email: string; password: string }, { rejectWithValue, dispatch }) => {
        try {
            const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            return {
                Uid: res.user.uid,
                email: formData.email,
                firstName: '',
                lastName: '',
                phoneNumber: '',
                password: '',
                role: enmRole.user,
            } as typUser;
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential') {
                dispatch(setToast({
                    message: 'The account or password is not correct!',
                    severity: enmToastSeverity.error,
                }));
            }
            else {
                dispatch(setToast({
                    message: `Authentication failed: ${error.message}`,
                    severity: enmToastSeverity.error,
                }));
            }
            return rejectWithValue(error.code);
        }
    }
);

// loginUserWithGoogle
export const loginUserWithGoogle = createAsyncThunk(
    'auth/loginUserWithGoogle',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;

            const userData: typUser = {
                Uid: user.uid,
                email: user.email || '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                password: '',
                role: enmRole.user,
            };

            // Optional: You can call insertUser here if needed
            // insertUser(userData);

            return userData;
        } catch (error: any) {
            dispatch(
                setToast({
                    message: `Authentication failed: ${error.message}`,
                    severity: enmToastSeverity.error,
                })
            );
            return rejectWithValue(error.message);
        }
    }
);

export const loginUserWithFacebook = createAsyncThunk(
    'auth/loginUserWithFacebook',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const res = await signInWithPopup(auth, faceBookprovider);
            const user = res.user;

            const userData: typUser = {
                Uid: user.uid,
                email: user.email || '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                password: '',
                role: enmRole.user,
            };

            // Optional: You can call insertUser here if needed
            // insertUser(userData);

            return userData;
        } catch (error: any) {
            dispatch(
                setToast({
                    message: `Authentication failed: ${error.message}`,
                    severity: enmToastSeverity.error,
                })
            );
            return rejectWithValue(error.message);
        }
    }
);


// Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
    try {
        await signOut(auth);
        return true; // add this
    } catch (error: any) {
        dispatch(setToast({
            message: error.code,
            severity: enmToastSeverity.error
        }));
        throw error; // to properly reject the thunk
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.loading = true;
                state.isAuthorized = false;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isAuthorized = false;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthorized = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthorized = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isAuthorized = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthorized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthorized = false;
            })
            .addCase(loginUserWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isAuthorized = false;
            })
            .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthorized = true;
            })
            .addCase(loginUserWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthorized = false;
            })
            .addCase(loginUserWithFacebook.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isAuthorized = false;
            })
            .addCase(loginUserWithFacebook.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthorized = true;
            })
            .addCase(loginUserWithFacebook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthorized = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthorized = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
