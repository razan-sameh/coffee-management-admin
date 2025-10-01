/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import app, {
  faceBookprovider,
  googleProvider,
} from "../../services/configuration";
import { insertUser } from "../../database/insert";
import type { typPhone, typUser } from "../../content/types";
import { enmRole, enmToastSeverity } from "../../content/enums";
import { listenToUser } from "../../database/select";
import { setToast } from "./toastSlice";
import moment from "moment";

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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: typPhone;
  role: { label: string; value: string };
}
const auth = getAuth(app);

//initializeAuth
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    return new Promise<typUser | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const stopListening = listenToUser(user.uid, (userData: typUser) => {
            unsubscribe(); // stop Firebase auth listener
            stopListening(); // stop user DB listener

            if (
              userData.role === enmRole.customer ||
              userData.isActive == false
            ) {
              dispatch(
                setToast({
                  message: "Access denied.",
                  severity: enmToastSeverity.error,
                })
              );
              dispatch(logoutUser());
              resolve(null);
            } else {
              resolve(userData);
            }
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
  "auth/signupUser",
  async (formData: ISignupFormInput, { rejectWithValue, dispatch }) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const formattedDate = moment().format("MMM DD, YYYY");
      const user: typUser = {
        Uid: res.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: [formData.phone],
        password: formData.password,
        role: formData.role as unknown as enmRole, // ✅ FIXED
        isActive: true,
        createdAt: formattedDate,
      };
      insertUser(user);
      return user;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        dispatch(
          setToast({
            message: "That email address is already in use!",
            severity: enmToastSeverity.error,
          })
        );
      } else if (error.code === "auth/invalid-email") {
        dispatch(
          setToast({
            message: "That email address is invalid!",
            severity: enmToastSeverity.error,
          })
        );
      } else {
        dispatch(
          setToast({
            message: `Authentication failed: ${error.message}`,
            severity: enmToastSeverity.error,
          })
        );
      }
      return rejectWithValue(error.code);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    formData: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userData: typUser | null = await new Promise((resolve, reject) => {
        const unsubscribe = listenToUser(res.user.uid, (user) => {
          if (user.role === enmRole.customer || user.isActive == false) {
            dispatch(
              setToast({
                message: "Access denied.",
                severity: enmToastSeverity.error,
              })
            );
            unsubscribe(); // Stop listening immediately
            reject(new Error("customer-not-allowed"));
          } else {
            unsubscribe(); // Stop listening once user is fetched
            resolve(user);
          }
        });
      });

      return userData;
    } catch (error: any) {
      const errorCode =
        error?.message === "customer-not-allowed"
          ? "auth/customer-not-allowed"
          : error.code;

      if (errorCode === "auth/invalid-credential") {
        dispatch(
          setToast({
            message: "The account or password is not correct!",
            severity: enmToastSeverity.error,
          })
        );
      } else if (errorCode === "auth/customer-not-allowed") {
        // Already handled above, no extra toast needed
      } else {
        dispatch(
          setToast({
            message: `Authentication failed: ${error.message}`,
            severity: enmToastSeverity.error,
          })
        );
      }
      return rejectWithValue(errorCode);
    }
  }
);

// loginUserWithGoogle
export const loginUserWithGoogle = createAsyncThunk(
  "auth/loginUserWithGoogle",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      const userData: typUser | null = await new Promise((resolve, reject) => {
        const unsubscribe = listenToUser(res.user.uid, (user) => {
          if (user.role === enmRole.customer || user.isActive == false) {
            dispatch(
              setToast({
                message: "Access denied.",
                severity: enmToastSeverity.error,
              })
            );
            unsubscribe(); // Stop listening immediately
            reject(new Error("customer-not-allowed"));
          } else {
            unsubscribe(); // Stop listening once user is fetched
            resolve(user);
          }
        });
      });

      return userData;
    } catch (error: any) {
      const errorCode =
        error?.message === "customer-not-allowed"
          ? "auth/customer-not-allowed"
          : error.code;

      if (errorCode === "auth/invalid-credential") {
        dispatch(
          setToast({
            message: "The account or password is not correct!",
            severity: enmToastSeverity.error,
          })
        );
      } else if (errorCode === "auth/customer-not-allowed") {
        // Already handled above, no extra toast needed
      } else {
        dispatch(
          setToast({
            message: `Authentication failed: ${error.message}`,
            severity: enmToastSeverity.error,
          })
        );
      }
      return rejectWithValue(errorCode);
    }
  }
);

export const loginUserWithFacebook = createAsyncThunk(
  "auth/loginUserWithFacebook",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await signInWithPopup(auth, faceBookprovider);
      const userData: typUser | null = await new Promise((resolve, reject) => {
        const unsubscribe = listenToUser(res.user.uid, (user) => {
          if (user.role === enmRole.customer || user.isActive == false) {
            dispatch(
              setToast({
                message: "Access denied.",
                severity: enmToastSeverity.error,
              })
            );
            unsubscribe(); // Stop listening immediately
            reject(new Error("customer-not-allowed"));
          } else {
            unsubscribe(); // Stop listening once user is fetched
            resolve(user);
          }
        });
      });

      return userData;
    } catch (error: any) {
      const errorCode =
        error?.message === "customer-not-allowed"
          ? "auth/customer-not-allowed"
          : error.code;

      if (errorCode === "auth/invalid-credential") {
        dispatch(
          setToast({
            message: "The account or password is not correct!",
            severity: enmToastSeverity.error,
          })
        );
      } else if (errorCode === "auth/customer-not-allowed") {
        // Already handled above, no extra toast needed
      } else {
        dispatch(
          setToast({
            message: `Authentication failed: ${error.message}`,
            severity: enmToastSeverity.error,
          })
        );
      }

      return rejectWithValue(errorCode);
    }
  }
);

export const sendResetPasswordEmail = createAsyncThunk(
  "auth/sendResetPasswordEmail",
  async (email: string, { rejectWithValue, dispatch }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch(
        setToast({
          message: "Password reset email sent successfully.",
          severity: enmToastSeverity.success,
        })
      );
    } catch (error: any) {
      console.error("Reset error:", error);
      dispatch(
        setToast({
          message: `Failed to send reset email: ${error.message}`,
          severity: enmToastSeverity.error,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      dispatch(setUser(null));
      await signOut(auth);
      return true; // add this
    } catch (error: any) {
      dispatch(
        setToast({
          message: error.code,
          severity: enmToastSeverity.error,
        })
      );
      throw error; // to properly reject the thunk
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
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

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
