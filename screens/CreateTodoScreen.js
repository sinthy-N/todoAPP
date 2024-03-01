// screens -> CreateTodoScreen.js

import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity, ImageBackground } from "react-native";
import { database, auth } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient'; // Assurez-vous d'installer expo-linear-gradient
import { Alert } from "react-native";

// Importation d'une image depuis le fichier "Purple.jpg"
const Purple = require("../assets/Purple.jpg")

// Définition du composant AddTodoScreen avec des propriétés (props)
const AddTodoScreen = (props) => {
  // Utilisation du hook useState pour gérer l'état local du composant
  const [state, setState] = useState({
    title: '', // Titre
    description: '', // Description
  });

  // Fonction pour mettre à jour le state lors de la saisie dans les champs de texte
  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  // Fonction pour sauvegarder un nouveau todo dans la base de données
  const saveNewTodo = async () => {
    // Vérification si le titre est vide
    // La méthode `trim()` pour supprimer les espaces blancs au début et à la fin d'une chaîne de caractères
    if (state.title.trim() === "") {
      // Affichage d'une alerte en cas d'erreur
      Alert.alert("Erreur", "Veuillez fournir un titre non vide.");
    } else {
      try {
        // Collection "todos" dans la base de données Firestore
        const todosCollection = collection(database, 'todos');
        // Définition d'un nouvel objet `newTodoData` qui représente les données d'un nouveau todo
        const newTodoData = {
          // Attribution du titre du todo en utilisant la valeur du champ 'title' de l'état (state)
          title: state.title.trim(),
          // Attribution de la description du todo en utilisant la valeur du champ 'description' de l'état (state)
          description: state.description.trim(),
          // Attribution de l'identifiant de l'utilisateur actuellement connecté en utilisant l'objet 'currentUser' de l'authentification (auth)
          userId: auth.currentUser.uid,
        };

        // Utilisation de la fonction asynchrone `addDoc` pour ajouter le nouvel objet `newTodoData` à la collection "todos"
        await addDoc(todosCollection, newTodoData);
        // Redirection vers l'écran "TodosList" après un ajout réussi
        props.navigation.navigate("TodosList");
      } catch (error) {
        // Bloc de capture pour gérer les erreurs qui pourraient se produire pendant l'ajout du todo
        // Affichage d'une erreur détaillée dans la console
        console.error('Erreur lors de l\'enregistrement d\'une nouvelle todo :', error);
        // Affichage d'une alerte informant l'utilisateur qu'une erreur s'est produite lors de l'ajout du todo
        Alert.alert("Erreur", "Une erreur s'est produite lors de l'enregistrement de la nouvelle todo.");
      }
    }
  };


  // Rendu de l'écran avec un arrière-plan dégradé
  return (
    // Retourne un composant ImageBackground avec la source Purple et le style défini dans la variable styles.container
    <ImageBackground source={Purple} style={styles.container}>
      {/* ScrollView pour permettre le défilement du contenu */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Groupe d'entrées pour le titre et la description du todo */}
        <View style={styles.inputGroup}>
          {/* Champ de texte pour le titre du todo */}
          <TextInput
            placeholder="Titre"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
            placeholderTextColor="#666"  // Couleur du texte indicatif
            value={state.title}  // La valeur du champ est liée à la variable 'state.title', permettant de contrôler son contenu
            onChangeText={(value) => handleChangeText("title", value)}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'state.title'
            style={styles.input}  // Style du champ de saisie défini dans la variable styles.input
          />
          {/* Ligne grise en dessous du champ de titre */}
          <View style={styles.border} />
          {/* Champ de texte pour la description du todo */}
          <TextInput
            placeholder="Description"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
            placeholderTextColor="#666"  // Couleur du texte indicatif
            multiline={true}  // Permet la saisie sur plusieurs lignes
            numberOfLines={4}  // Nombre de lignes affichées initialement
            value={state.description}  // La valeur du champ est liée à la variable 'state.description', permettant de contrôler son contenu
            onChangeText={(value) => handleChangeText("description", value)}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'state.description'
            style={[styles.input, styles.inputDescription]}  // Styles du champ de saisie définis dans les variables styles.input et styles.inputDescription
          />
        </View>
        {/* Bouton pour ajouter le todo */}
        {/* Bouton tactile avec le style défini dans la variable styles.button et appel de la fonction saveNewTodo lorsqu'il est pressé */}
        <TouchableOpacity style={styles.button} onPress={saveNewTodo}>
          {/* Texte du bouton avec le style défini dans la variable styles.buttonText */}
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

// Styles pour les composants
const styles = StyleSheet.create({
  // Style du conteneur principal du composant
  container: {
    flex: 1, // Utilisation de tout l'espace disponible
    padding: 35, // Marge intérieure de 35 unités sur tous les côtés
    backgroundColor: "#fff", // Fond blanc
  },
  // Styles pour le groupe d'entrées (inputGroup)
inputGroup: {
  backgroundColor: "#FFFFFF",  // Couleur de fond blanche
  borderRadius: 10,  // Bordure arrondie avec un rayon de 10 unités
  padding: 15,  // Espace intérieur de 15 unités
  fontSize: 16,  // Taille de la police
  marginTop: 10,  // Marge supérieure de 10 unités
  shadowColor: "#000",  // Couleur de l'ombre
  shadowOffset: { width: 0, height: 2 },  // Décalage de l'ombre
  shadowOpacity: 0.25,  // Opacité de l'ombre
  shadowRadius: 3.84,  // Rayon de l'ombre
  elevation: 5,  // Élévation de l'ombre (pour Android)
},
// Styles pour le bouton (button)
button: {
  marginTop: 16,  // Marge supérieure de 16 unités
  marginBottom: 16,  // Marge inférieure de 16 unités
  fontSize: 16,  // Taille de la police de 16
  borderRadius: 10,  // Bord arrondi avec un rayon de 10 unités
  height: 50,  // Hauteur de 50 unités
  backgroundColor: '#4CAF50',  // Couleur verte
  alignItems: 'center',  // Alignement central vertical
  justifyContent: 'center',  // Alignement central horizontal
  width: '100%',  // Largeur à 100%
  alignSelf: 'center',  // Alignement au centre par rapport à lui-même
  borderRadius: 10,  // Bord arrondi avec un rayon de 10 unités
},
// Styles pour le texte du bouton (buttonText)
buttonText: {
  color: "#ffffff",  // Couleur du texte en blanc
  fontSize: 20,  // Taille de la police de 20
  fontWeight: "bold",  // Texte en gras
},
// Styles pour la bordure (border)
border: {
  borderBottomWidth: 1,  // Largeur de la bordure inférieure de 1 unité
  borderBottomColor: '#ccc',  // Couleur de la bordure inférieure en gris
  marginHorizontal: -15,  // Marge horizontale de -15 unités (pour compenser le padding dans inputGroup)
  marginTop: 10,  // Marge supérieure de 10 unités
},

});

// Exportation du composant AddTodoScreen pour une utilisation dans d'autres parties de l'application
export default AddTodoScreen;