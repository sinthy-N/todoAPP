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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

const TodoDetailScreen = (props) => {
  const initialState = {
    id: "",
    title: "",
    description: "",
  };

  const [todo, setTodo] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);

  const handleTextChange = (value, prop) => {
    setTodo({ ...todo, [prop]: value });
    setIsModified(true);
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

  const confirmDelete = () => {
    Alert.alert(
      "Suppression de la Todo",
      "Êtes-vous sûr ?",
      [
        { text: "Non" },
        { text: "Oui", onPress: deleteTodo },
      ],
      { cancelable: false }
    );
  };

  const updateTodo = async () => {
    const dbRef = doc(database, 'todos', todo.id);
    await updateDoc(dbRef, {
      title: todo.title,
      description: todo.description,
    });
    setIsModified(false);
    props.navigation.navigate("TodosList");
  };

  const confirmUpdate = () => {
    if (isModified) {
      Alert.alert(
        "Modification de la Todo",
        "Êtes-vous sûr ?",
        [
          { text: "Non" },
          { text: "Oui", onPress: updateTodo },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Aucun changement", "Aucune modification n'a été apportée sur la Todo.");
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
    <LinearGradient colors={['#957DAD', '#BFA2DB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#666"
            value={todo.title}
            onChangeText={(value) => handleTextChange(value, "title")}
            style={styles.input}
          />
          <View style={styles.border} />
          <TextInput
            placeholder="Description"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={4}
            value={todo.description}
            onChangeText={(value) => handleTextChange(value, "description")}
            style={[styles.input, styles.inputDescription]}
          />
        </View>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={confirmUpdate}>
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
          <FontAwesomeIcon icon={faTrash} size={24} style={{color: "#fff",}} />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: "#fff",
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
  button: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 10,
    height: 50,
    width: '100%', // Adjust the width as needed
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#4CAF50', // Green color as an example
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF5252', // Red color as an example
    marginTop: 8, // Ajustez la valeur selon vos besoins pour rapprocher les boutons

  },
  inputGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: -15,
    marginTop: 10,
  },
});

export default TodoDetailScreen;