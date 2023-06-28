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
import { toast } from "react-toastify";
import {
  ImageUploadParams,
  LoginParams,
  SignupParams,
  UpdateUserDetailsParams,
} from "./types";

// thunk to singup user
export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials: SignupParams, { rejectWithValue }) => {
    try {
      const { name, email, password, phone } = credentials;

      // firebase method to signup user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // updating user profile in auth service of firebase
      await updateProfile(user, { displayName: name });
      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        profileImage: "",
        bio: "",
        phone: phone,
      };
      // adding user to firestore
      await setDoc(doc(db, "users", user.uid), userData);
      toast.success(`Welcome, ${userData.name}`);
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.code);
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk for logging in user
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginParams, { rejectWithValue }) => {
    try {
      const { email, password } = credentials;

      // logging in user
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // getting that user data from firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      toast.success(`Welcome back, ${userData?.name}`);
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.code);
        return rejectWithValue(error.message);
      }
    }
  }
);
// thunk to logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out!");
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to upload image of user
export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async ({ file, uid }: ImageUploadParams, { rejectWithValue }) => {
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
      toast.success("Image updated successfully");
      return downloadURL;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to update user details
export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ userData, uid }: UpdateUserDetailsParams, { rejectWithValue }) => {
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
      toast.success("User details updated!");
      return userData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to track current user
export const trackCurrentUser = (): AppThunk => (dispatch) => {
  dispatch(setLoading(true));
  // tracking user's auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid, refreshToken } = user;

      // storing token in localstorage
      localStorage.setItem("token", refreshToken);
      
      // getting that user from firestore
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
