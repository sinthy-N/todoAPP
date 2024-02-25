import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import { database, auth } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient'; // Assurez-vous d'installer expo-linear-gradient
import { Alert } from "react-native";


const AddTodoScreen = (props) => {
  const [state, setState] = useState({
    title: '',
    description: '',
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveNewTodo = async () => {
    if (state.title.trim() === "") {
      Alert.alert("Erreur", "Veuillez fournir un titre non vide.");
    } else {
      try {
        const todosCollection = collection(database, 'todos');
        const newTodoData = {
          title: state.title.trim(),
          description: state.description.trim(),
          userId: auth.currentUser.uid,
          isDone: state.isDone || false,
        };
  
        await addDoc(todosCollection, newTodoData);
        props.navigation.navigate("TodosList");
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement d\'une nouvelle todo :', error);
        // You might want to show an alert or handle the error in some way.
        Alert.alert("Erreur", "Une erreur s'est produite lors de l'enregistrement de la nouvelle todo.");
      }
    }
  };
  



  return (
    <LinearGradient colors={['#957DAD', '#BFA2DB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Titre"
            placeholderTextColor="#666"
            value={state.title}
            onChangeText={(value) => handleChangeText("title", value)}
            style={styles.input}
          />
          {/* Ajouter une ligne grise ici */}
          <View style={styles.border} />
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
          <Text style={styles.buttonText}>Ajouter</Text>
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
    width: '100%', // Adjust the width as needed
    alignSelf: 'center', // Center the button horizontally
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: -15, // Pour étendre la ligne sur toute la largeur
    marginTop: 10, // Ajouter une marge en haut
  },


});

export default AddTodoScreen;
