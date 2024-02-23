  import React, { useState, createContext, useContext, useEffect } from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth } from './config/firebase';
  import { signOut } from 'firebase/auth';

  import Login from './screens/Login';
  import Signup from './screens/Signup';
  import TodoScreen from './screens/TodosList';
  import AddTodoScreen from './screens/CreateTodoScreen';
  import TodoDetailScreen from './screens/ToDoDetailScreen';
  import UserProfileScreen from './screens/UserProfileScreen';
  import { Ionicons } from "@expo/vector-icons";


  const Stack = createStackNavigator();
  const AuthenticatedUserContext = createContext();
  
  const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      });
      return unsubscribe; // Unsubscribe on unmount
    }, []);
  
    return (
      <AuthenticatedUserContext.Provider value={{ user, setUser }}>
        {children}
      </AuthenticatedUserContext.Provider>
    );
  };
  
  function MyStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#6B36AF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="TodosList"
          component={TodoScreen}
          options={({ navigation }) => ({
            title: "Todos",
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => navigation.navigate("UserProfileScreen")} style={{ marginRight: 16 }}>
                  <Ionicons name="person-circle-outline" size={25} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  await signOut(auth);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }} style={{ marginRight: 10 }}>
                  <Ionicons name="exit-outline" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="CreateTodoScreen"
          component={AddTodoScreen}
          options={{ title: "Create Todo" }}
        />
        <Stack.Screen
          name="TodoDetailScreen"
          component={TodoDetailScreen}
          options={{ title: "Todo Detail" }}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfileScreen}
          options={{ title: "User Profile" }}
        />
      </Stack.Navigator>
    );
  }
  
  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    );
  }
  
  function RootNavigator() {
    const { user } = useContext(AuthenticatedUserContext);
  
    if (!user) {
      return <AuthStack />;
    }
  
    return <MyStack />;
  }
  
  export default function App() {
    return (
      <AuthenticatedUserProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthenticatedUserProvider>
    );
  }
  
