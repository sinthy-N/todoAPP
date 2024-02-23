import { initializeApp, getReactNativePersistence } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";





import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHVVmsOJwhJfVpFfdGm38KbrnZKuMucN4",
  authDomain: "todo-app-82711.firebaseapp.com",
  projectId: "todo-app-82711",
  storageBucket: "todo-app-82711.appspot.com",
  messagingSenderId: "1096440345491",
  appId: "1:1096440345491:web:87b6491158d73be62aee66"
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);