// Importation des modules React et des fonctionnalités de navigation depuis React Navigation
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importation des composants React Native
import { View, TouchableOpacity } from 'react-native';

// Importation des fonctionnalités de gestion de l'authentification Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';

// Importation des composants de différentes vues
import Login from './screens/Login';
import Signup from './screens/Signup';
import TodoScreen from './screens/TodosList';
import AddTodoScreen from './screens/CreateTodoScreen';
import TodoDetailScreen from './screens/ToDoDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';

// Importation d'icônes FontAwesome pour une utilisation dans l'application
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';


// Création d'une pile de navigation avec React Navigation
const Stack = createStackNavigator();
// Création d'un contexte pour stocker les informations sur l'utilisateur authentifié
const AuthenticatedUserContext = createContext();
// Création d'un fournisseur de contexte pour gérer l'état de l'utilisateur authentifié
const AuthenticatedUserProvider = ({ children }) => {
  // Utilisation de l'état local pour stocker les informations sur l'utilisateur
  const [user, setUser] = useState(null);
  // Effet secondaire pour écouter les changements d'état de l'authentification
  useEffect(() => {
    // Fonction onAuthStateChanged pour écouter les changements d'état de l'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, async authenticatedUser => {
      // Mise à jour de l'état local en fonction de la présence ou de l'absence d'un utilisateur authentifié
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
    });
    // Unsubscribe lorsque le composant est démonté pour éviter les fuites de mémoire
    return unsubscribe;
  }, []);

  // Rendu du composant avec le contexte fournissant l'état de l'utilisateur authentifié
  return (
    // Utilisation du composant Provider du contexte avec la valeur définie
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {/* Les composants enfants seront rendus à l'intérieur de ce Provider */}
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// Définition d'une fonction de composant nommée MyStack
function MyStack() {
  // Rendu du composant Stack.Navigator avec des options de style pour les écrans
  return (
    <Stack.Navigator
      // Options de style globales pour les en-têtes de navigation
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6B36AF", // Couleur de fond de l'en-tête
        },
        headerTintColor: "#fff", // Couleur du texte de l'en-tête
        headerTitleStyle: {
          fontWeight: "bold", // Style de police du texte de l'en-tête
        },
      }}
    >
      {/* Définition d'une pile d'écrans avec un écran nommé "TodosList"*/}
      <Stack.Screen
        name="TodosList"
        component={TodoScreen} // Utilisation du composant TodoScreen comme composant de l'écran
        options={({ navigation }) => ({
          // Options spécifiques à l'écran
          title: "Todos", // Titre de l'écran
          headerRight: () => (
            // Composant TouchableOpacity dans le coin supérieur droit de l'en-tête pour naviguer vers l'écran UserProfileScreen
            <TouchableOpacity onPress={() => navigation.navigate("UserProfileScreen")} style={{ marginRight: 15 }}>
              {/* Icône FontAwesome */}
              <FontAwesomeIcon icon={faCircleUser} size={25} color="#fff" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Center the title
          headerLeft: () => (
            // Composant View avec TouchableOpacity pour déclencher la déconnexion et la navigation vers l'écran Login
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={async () => {
                await signOut(auth); // Déconnexion de l'utilisateur
                navigation.reset({
                  index: 0,
                  // Réinitialisation de la pile de navigation vers l'écran Login
                  routes: [{ name: 'Login' }],
                });
              }} style={{ marginLeft: 15 }}>
                {/* Icône FontAwesome */}
                <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {/* Écran pour créer une nouvelle Todo */}
      <Stack.Screen
        name="CreateTodoScreen"
        component={AddTodoScreen} // Utilisation du composant AddTodoScreen comme composant de l'écran
        options={{ title: "Créer une Todo" }} // Options de l'écran avec le titre spécifié
      />

      {/* Écran pour afficher les détails d'une Todo */}
      <Stack.Screen
        name="TodoDetailScreen"
        component={TodoDetailScreen} // Utilisation du composant TodoDetailScreen comme composant de l'écran
        options={{ title: "Détail Todo" }} // Options de l'écran avec le titre spécifié
      />

      {/* Écran pour afficher le profil utilisateur */}
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen} // Utilisation du composant UserProfileScreen comme composant de l'écran
        options={{ title: "Votre profile" }} // Options de l'écran avec le titre spécifié
      />
    </Stack.Navigator>
  );
}

// Définition d'une pile d'écrans pour l'authentification
function AuthStack() {
  return (
    // Utilisation du composant Stack.Navigator avec les options globales d'en-tête désactivées
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Écran de connexion */}
      <Stack.Screen name="Login" component={Login} />
      {/* Écran d'inscription */}
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

// Définition d'un composant de navigation racine
function RootNavigator() {
  // Utilisation du contexte pour récupérer l'état de l'utilisateur authentifié
  const { user } = useContext(AuthenticatedUserContext);
  // Vérification de la présence de l'utilisateur
  if (!user) {
    // Si l'utilisateur n'est pas authentifié, renvoyer la pile d'écrans d'authentification
    return <AuthStack />;
  }
  // Si l'utilisateur est authentifié, renvoyer la pile principale d'écrans
  return <MyStack />;
}

// Définition de la fonction principale de l'application
export default function App() {
  // Rendu de l'ensemble de l'application encapsulée dans le fournisseur d'utilisateur authentifié
  return (
    <AuthenticatedUserProvider>
      {/* Conteneur de navigation pour toute l'application */}
      <NavigationContainer>
        {/* Utilisation du composant RootNavigator comme point d'entrée de la navigation */}
        <RootNavigator />
      </NavigationContainer>
    </AuthenticatedUserProvider>
  );
}

