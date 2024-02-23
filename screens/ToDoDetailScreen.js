import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { database } from "../config/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

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
    const dbRef = doc(database, 'todos', id);
    const docSnap = await getDoc(dbRef);
    if (docSnap.exists()) {
      setTodo({ ...docSnap.data(), id: docSnap.id });
      setLoading(false);
    } else {
      Alert.alert("Document not found");
    }
  };

  const deleteTodo = async () => {
    const dbRef = doc(database, 'todos', todo.id);
    await deleteDoc(dbRef);
    props.navigation.navigate("TodosList");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Removing the Todo",
      "Are you sure?",
      [
        { text: "No" },
        { text: "Yes", onPress: deleteTodo },
      ],
      { cancelable: true }
    );
  };

  const updateTodo = async () => {
    const dbRef = doc(database, 'todos', todo.id);
    await updateDoc(dbRef, {
      title: todo.title,
      description: todo.description,
    });
    props.navigation.navigate("TodosList");
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
    <LinearGradient colors={['#957DAD', '#BFA2DB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#666"
          value={todo.title}
          onChangeText={(value) => handleTextChange(value, "title")}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#666"
          multiline={true}
          numberOfLines={4}
          value={todo.description}
          onChangeText={(value) => handleTextChange(value, "description")}
          style={[styles.input, styles.inputDescription]}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openConfirmationAlert}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={updateTodo}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
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