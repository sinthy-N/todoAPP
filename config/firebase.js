//config -> firebase.js

// Importation des modules nécessaires

// Module AsyncStorage pour la persistance des données
import AsyncStorage from '@react-native-async-storage/async-storage';
// Initialisation de l'application Firebase
import { initializeApp } from 'firebase/app';
// Initialisation de l'authentification Firebase
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// Obtention du module Firestore pour interagir avec la base de données
import { getFirestore } from "firebase/firestore";


// Objet de configuration Firebase avec les détails de notre projet
const firebaseConfig = {
  apiKey: "AIzaSyCHVVmsOJwhJfVpFfdGm38KbrnZKuMucN4", // Clé API pour l'authentification Firebase
  authDomain: "todo-app-82711.firebaseapp.com", // Domaine d'authentification Firebase
  projectId: "todo-app-82711", // ID du projet Firebase
  storageBucket: "todo-app-82711.appspot.com", // Bucket de stockage Firebase
  messagingSenderId: "1096440345491", // ID de l'envoi de messages Firebase
  appId: "1:1096440345491:web:87b6491158d73be62aee66" // ID de l'application Firebase  
};

// Initialisation de Firebase avec la configuration fournie
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification Firebase avec persistance React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Exportation de l'objet d'authentification pour une utilisation ultérieure
export { auth };

// Obtention de l'instance de la base de données Firestore
export const database = getFirestore(app);