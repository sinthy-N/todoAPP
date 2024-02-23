import { initializeApp, getReactNativePersistence } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";





import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJsPevBXHC-KSqR_hrg-0n8Fet4z_vHAU",
  authDomain: "todo-7de28.firebaseapp.com",
  projectId: "todo-7de28",
  storageBucket: "todo-7de28.appspot.com",
  messagingSenderId: "1083651176082",
  appId: "1:1083651176082:web:48818870b109f8a313d84b",
  measurementId: "G-GJ21EDFJDF",
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);