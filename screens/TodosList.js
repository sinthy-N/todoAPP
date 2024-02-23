import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Audio } from "expo-av";
import { database, auth } from '../config/firebase';
import { getFirestore, collection, addDoc, onSnapshot , doc, getDoc, deleteDoc, querySnapshot } from "firebase/firestore";
import { Icon } from "react-native-elements";

import { Ionicons } from "@expo/vector-icons";
import UserProfileScreen from "./UserProfileScreen";
import CheckBoxIcon from "react-native-elements/dist/checkbox/CheckBoxIcon";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { signOut } from 'firebase/auth';

const deleteTodo = async (todo) => {
  try {
    
    const dbRef = doc(database, 'todos', todo.id);
    await deleteDoc(dbRef);
      
  } catch (err) {
    console.error('Error deleting todo:', err);
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    // Add any additional cleanup or navigation logic if needed
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


const TodoScreen = (props) => {
  const [todos, setTodos] = useState([]);
  const [activeView, setActiveView] = useState("todos");
  const [Pressed, setDone] = useState();

  useEffect(() => {
    // Subscribe to Firestore collections "todos" and "voices"
    const unsubscribeTodos = onSnapshot(collection(database, 'todos'), (querySnapshot) => {
      const todosArray = querySnapshot.docs
        .filter((doc) => doc.data().userId === auth.currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(todosArray);
    });   
   
     
    return () => {
      unsubscribeTodos();
      
    };
  })

  

  

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button color="#6B36AF" title="Todos" onPress={() => setActiveView("todos")} />
        
        <Button color="#6B36AF" title="User Profile" onPress={() => props.navigation.navigate(UserProfileScreen)} />
        <Button title="Logout" onPress={handleLogout} color="#6B36AF" />

      </View>
      <ScrollView style={styles.scrollView}>
        {activeView === "todos" && todos.map((todo)  => (
              
          <ListItem key={todo.id}
          bottomDivider
          onPress={() => {
            props.navigation.navigate("TodoDetailScreen", {
              todoId: todo.id,
            });
          }}>

             <CheckBox 
              key={todo.id}
              title="Done"
              checked={Pressed}
              onPress={() => setDone(!Pressed)}/>

            <ListItem.Content> 
                               
              <ListItem.Title style={styles.title4}>{todo.title}</ListItem.Title>
              <ListItem.Subtitle>{todo.description}</ListItem.Subtitle>
              <Button onPress={() => deleteTodo(todo)} color={"red"} title="Delete"></Button>

            </ListItem.Content>
          </ListItem>
        ))}
        
        
        </ScrollView>
      
      {activeView === "todos" ? (
      <TouchableOpacity
          style={styles.createTodoButton}
          onPress={() => props.navigation.navigate("CreateTodoScreen")}
        >
          <Ionicons name="add-circle" size={64} color="#6B36AF" />
        </TouchableOpacity>
        ) : null}
        
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    fontWeight: 'bold',
    
  },
  scrollView: {
    flex: 1,
    
  },
  createVoiceButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
  },
  createTodoButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
  },
 
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#6B36AF",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#A99ABB",
    height: 58,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#6B36AF',
    height: 55,
    width: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    margin: 95
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#6B36AF",
    paddingBottom: 24,
  },
  title3: {
    fontSize: 15,
    color: "#6B36AF",
    paddingBottom: 24,
  },
  placeholder: {
    color: 'red',
    opacity: 1, 
  },
  title4: {
    fontWeight : 'bold',
  },
  avatar: {
    backgroundColor : 'lightgray',
        
  },

  Avatar:{
    
    backgroundColor :'lightgray',
    icon : {name: 'check', type: 'font-awesome'}

  }
  
  
});

export default TodoScreen;