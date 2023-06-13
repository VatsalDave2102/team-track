/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { setError, setLoading, setUser } from "./authSlice";
import { FirebaseError } from "firebase/app";
import { AppThunk } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { name, email, password } = credentials;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, { displayName: name });
      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { email, password } = credentials;
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      };
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const trackCurrentUser = (): AppThunk => (dispatch) => {
  dispatch(setLoading(true));
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const {
        email: userEmail,
        displayName: userName,
        uid: userUid,
        refreshToken,
      } = user;
      localStorage.setItem("token", refreshToken);
      dispatch(setUser({ name: userName!, email: userEmail!, uid: userUid }));
      dispatch(setLoading(false));
    } else {
      localStorage.removeItem("token");
      dispatch(setUser(null));
      dispatch(setLoading(false));
    }
  });
};

export const checkToken = (): AppThunk => (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        const {
          displayName: userName,
          email: userEmail,
          uid: userUid,
        } = userCredential.user;
        dispatch(setUser({ name: userName!, email: userEmail!, uid: userUid }));
      })
      .catch((error) => {
        if (error instanceof FirebaseError) dispatch(setError(error.message));
      });
  }
};
