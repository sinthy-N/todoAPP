import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import { database, auth } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient'; // Assurez-vous d'installer expo-linear-gradient

const AddTodoScreen = (props) => {
  const [state, setState] = useState({
    title: '',
    description: '',
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveNewTodo = async () => {
    if (state.title === "") {
      alert("Please provide a title");
    } else {
      try {
        const todosCollection = collection(database, 'todos');
        await addDoc(todosCollection, {
          title: state.title,
          description: state.description,
          userId: auth.currentUser.uid,
        });
        props.navigation.navigate("TodosList");
      } catch (error) {
        console.error('Error saving new todo:', error);
      }
    }
  };

  return (
    <LinearGradient colors={['#957DAD', '#BFA2DB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#666"
            value={state.title}
            onChangeText={(value) => handleChangeText("title", value)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={4}
            value={state.description}
            onChangeText={(value) => handleChangeText("description", value)}
            style={[styles.input, styles.inputDescription]}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveNewTodo}>
          <Text style={styles.buttonText}>Save To Do</Text>
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
  
  inputGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  button: {
    marginTop: 20,
    height: 35,
    backgroundColor: '#6B36AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
});

export default AddTodoScreen;
