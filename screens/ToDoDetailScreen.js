import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { auth, database } from "../config/firebase";
import { getFirestore, collection, addDoc, onSnapshot , doc, getDoc , updateDoc, deleteDoc, setDoc } from "firebase/firestore";




const TodoDetailScreen = (props) => {
  const initialState = {
    id: "",
    title: "",
    description: "",
  };

  const [todo, setTodo] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setTodo({ ...todo, [prop]: value });
  };

  const getTodoById = async (id) => {
    try {
      const dbRef = doc(database, 'todos', id);
      const docSnapshot = await getDoc(dbRef);
      if (docSnapshot.exists()) {
        const todo = docSnapshot.data();
        setTodo({ ...todo, id: docSnapshot.id });
        setLoading(false);
      } else {
        console.log('Todo not found');
      }
    } catch (err) {
      console.error('Error fetching todo:', err);
    }
  };
  
  const deleteTodo = async () => {
    try {
      
      
      const dbRef = doc(database, 'todos', todo.id);
      await deleteDoc(dbRef);
      

      props.navigation.navigate("TodosList");
      // Navigate to "TodosList" screen after deleting
      // You'll need to pass the navigation prop to this function
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };
  

  const openConfirmationAlert = () => {
    Alert.alert(
      "Removing the Todo",
      "Are you sure?",
      [
        { text: "No", onPress: () => console.log("canceled") },
        { text: "Yes", onPress: () => deleteTodo() },
        
      ],
      {
        cancelable: true,
      }
    );
  };

  const updateTodo = async () => {
    try {
      const todoRef = doc(database, 'todos', todo.id);
      await setDoc(todoRef, {
        title: todo.title,
        description: todo.description,
        userId : auth.currentUser.uid
      });

      props.navigation.navigate("TodosList");
      // Reset the todo state (if needed)
      // props.navigation.navigate("TodosList"); // You'll need to pass the navigation prop to this function
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };
  

  useEffect(() => {
    getTodoById(props.route.params.todoId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput 
          placeholder="Title"
          autoCompleteType="todotitle"
          style={styles.input}
          value={todo.title}
          onChangeText={(value) => handleTextChange(value, "title")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="description"
          placeholder="Description"
          style={styles.input}
          value={todo.description}
          onChangeText={(value) => handleTextChange(value, "description")}
        />
      </View>
      <View style={styles.btn} backgroundColor= 'lightgray' borderRadius='15'>
        <Button
        
          title="Delete"
          onPress={() => openConfirmationAlert()}
          color="red"
        />
      </View>
      <View backgroundColor= 'lightgray' borderRadius='15'>
        <Button  title="Update" onPress={() => updateTodo()} color="#26B943" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
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
    marginBottom: 20,
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
    marginTop: 10,
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
  }
});

export default TodoDetailScreen;