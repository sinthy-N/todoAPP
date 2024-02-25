
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
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
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export const database = getFirestore(app);