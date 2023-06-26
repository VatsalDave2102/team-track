/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { setLoading, setUser } from "./authSlice";
import { FirebaseError } from "firebase/app";
import { AppThunk } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      phone: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { name, email, password, phone } = credentials;
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
        profileImage: "",
        bio: "",
        phone: phone,
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
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
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
export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async ({ file, uid }: { file: File; uid: string }, { rejectWithValue }) => {
    try {
      // checking if user has already an existing profile image
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      if (userData && userData.profileImage) {
        const existingImagePath = userData.profileImage;
        const existingImageRef = ref(storage, existingImagePath);
        await deleteObject(existingImageRef);
      }

      // uploading the new profile image
      const storageRef = ref(storage, `user-images/${uid}/profileImage.png`);
      const snapshot = await uploadBytes(storageRef, file);

      // getting the download url
      const downloadURL = await getDownloadURL(snapshot.ref);

      // updating the user in firestore
      await updateDoc(userDocRef, { profileImage: downloadURL });

      // updating user profile image in authentication service
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { photoURL: downloadURL });
      }
      return downloadURL;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

interface UpdateUserDetails {
  userData: { bio: string; phone: string };
  uid: string;
}
export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ userData, uid }: UpdateUserDetails, { rejectWithValue }) => {
    try {
      const { bio, phone } = userData;
      // getting user reference
      const userDocRef = doc(db, "users", uid);

      // updating user doc in firestore
      await updateDoc(userDocRef, {
        bio: bio,
        phone: phone,
      });
      // returning the updated data
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const trackCurrentUser = (): AppThunk => (dispatch) => {
  dispatch(setLoading(true));
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid, refreshToken } = user;
      localStorage.setItem("token", refreshToken);
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      dispatch(
        setUser({
          name: userData?.name,
          email: userData?.email,
          uid,
          phone: userData?.phone,
          profileImage: userData?.profileImage,
          bio: userData?.bio,
        })
      );
      dispatch(setLoading(false));
    } else {
      localStorage.removeItem("token");
      dispatch(setUser(null));
      dispatch(setLoading(false));
    }
  });
};
