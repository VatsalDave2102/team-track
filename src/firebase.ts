import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyD0nxSz0G5rBOEFul-nfgMEbYB7Ae57oe8",
  authDomain: "team-track-dev.firebaseapp.com",
  projectId: "team-track-dev",
  storageBucket: "team-track-dev.appspot.com",
  messagingSenderId: "1029028600324",
  appId: "1:1029028600324:web:cde9cf791e36bfed2b7351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
setPersistence(auth, browserLocalPersistence)
export default app