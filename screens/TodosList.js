import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { ListItem, CheckBox } from "react-native-elements";
// Importation des modules Firebase pour la base de données et l'authentification
import { database, auth } from '../config/firebase';
// Importation de modules spécifiques Firebase pour la gestion de la base de données Firestore
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
// Importation du composant `LinearGradient` du module Expo
import { LinearGradient } from 'expo-linear-gradient';
// Importation d'icônes spécifiques FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons/faDeleteLeft';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';

// Importation du composant `Alert` de React Native pour afficher des alertes
import { Alert } from "react-native";

// Importation d'une image depuis le fichier "Purple.jpg"
const Purple = require("../assets/Purple.jpg")

// Définition du composant fonctionnel `TodoScreen` avec des propriétés (props) en paramètre
const TodoScreen = (props) => {
  // Déclaration d'un état `todos` pour stocker les données des todos
  const [todos, setTodos] = useState([]);
  // Déclaration d'un état `searchQuery` pour stocker la valeur de la recherche
  const [searchQuery, setSearchQuery] = useState("");

  // Utilisation de l'effet `useEffect` pour mettre en place une écoute en temps réel sur la collection "todos"
  useEffect(() => {
    // La fonction `onSnapshot` écoute les modifications en temps réel dans la collection "todos"
    const unsubscribe = onSnapshot(collection(database, 'todos'), (querySnapshot) => {
      // Obtention d'un tableau de todos à partir du snapshot de la requête Firestore
      const todosArray = querySnapshot.docs
        // Filtrage des documents pour inclure uniquement ceux dont l'ID d'utilisateur correspond à l'utilisateur actuellement connecté
        .filter(doc => doc.data().userId === auth.currentUser.uid)
        // Transformation des documents en un tableau d'objets todo
        .map(doc => ({ id: doc.id, done: doc.data().done || false, ...doc.data() }));
      // Attribution de la propriété 'id' avec la valeur de l'ID du document Firestore
      // Attribution de la propriété 'done' avec la valeur de la propriété 'done' du document ou 'false' si elle est indéfinie
      // Utilisation de l'opérateur spread (...) pour inclure toutes les autres propriétés du document

      // Mise à jour de l'état `todos` avec le nouveau tableau de todos
      setTodos(todosArray);
    });

    // La fonction de nettoyage est retournée pour se désabonner lorsque le composant est démonté
    return () => unsubscribe();
  }, []); // Le tableau vide en tant que dépendance signifie que cet effet s'exécute une seule fois lors du montage initial du composant

  // Fonction asynchrone pour basculer l'état 'done' d'un todo dans la base de données
  const toggleTodoDone = async (todoId, isDone) => {
    // Obtention d'une référence au document du todo dans la collection "todos" de la base de données Firestore
    const todoRef = doc(database, 'todos', todoId);
    try {
      // Mise à jour du document todo avec la nouvelle valeur de la propriété 'done' (inversion de la valeur actuelle)
      await updateDoc(todoRef, { done: !isDone });
    } catch (error) {
      // Gestion des erreurs en cas d'échec de la mise à jour
      console.error("Error updating todo:", error);
    }
  };

  // Fonction asynchrone pour supprimer un todo de la base de données
  const deleteTodo = async (todoId) => {
    // Obtention d'une référence au document du todo dans la collection "todos" de la base de données Firestore
    const todoRef = doc(database, 'todos', todoId);
    try {
      // Suppression du document todo de la base de données
      await deleteDoc(todoRef);
    } catch (error) {
      // Gestion des erreurs en cas d'échec de la suppression
      console.error("Erreur lors de la suppression d'une todo :", error);
    }
  };

  // Fonction pour afficher une boîte de dialogue de confirmation avant la suppression d'un todo
  const confirmDelete = (todoId) => {
    Alert.alert(
      // Titre de la boîte de dialogue
      "Suppression de la Todo",
      // Message de confirmation
      "Êtes-vous sûr ?",
      // Options de bouton, avec un bouton "Non" et un bouton "Oui" qui déclenche la suppression si pressé
      [
        { text: "Non" },
        { text: "Oui", onPress: () => deleteTodo(todoId) },
      ],
      // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
      { cancelable: false }
    );
  };

  // Filtrage des todos en fonction de la valeur de recherche (searchQuery)
  const filteredTodos = todos.filter(todo =>
    // Vérification si le titre du todo (en minuscules) contient la valeur de recherche (en minuscules)
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // Vérification si la description du todo (en minuscules) contient la valeur de recherche (en minuscules)
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    //Composant ImageBackground avec la source Purple et le style défini dans la variable styles.container
    <ImageBackground source={Purple} style={styles.container}>
      {/* Vue contenant le champ de recherche */}
      <View style={styles.searchContainer}>
        {/* Icône de recherche */}
        <FontAwesomeIcon name="search" size={20} color="#B1B1B1" style={{ marginLeft: 10 }} icon={faMagnifyingGlass} />
        {/* Champ de saisie pour la recherche */}
        <TextInput
          style={styles.searchInput}  // Style du champ de saisie défini dans la variable styles.searchInput
          placeholder="Rechercher une Todo"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
          placeholderTextColor="#B1B1B1"  // Couleur du texte indicatif
          value={searchQuery}  // La valeur du champ est liée à la variable 'searchQuery', permettant de contrôler son contenu
          onChangeText={setSearchQuery}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'searchQuery'
        />
      </View>
      {/* ScrollView pour afficher la liste des todos filtrés */}
      <ScrollView style={styles.scrollView}>
        {/* Mapping à travers les todos filtrés pour les afficher */}
        {filteredTodos.map((todo) => (
          //TouchableOpacity pour rendre chaque todo cliquable 
          <TouchableOpacity key={todo.id} onPress={() => props.navigation.navigate("TodoDetailScreen", { todoId: todo.id })}>
            {/* ListItem pour chaque todo */}
            <ListItem key={todo.id} bottomDivider containerStyle={styles.listItem}>
              {/* CheckBox pour indiquer si le todo est terminé ou non */}
              <CheckBox
                checked={todo.done}  // Propriété checked basée sur l'état done du todo
                onPress={() => toggleTodoDone(todo.id, todo.done)}  // Appel de la fonction toggleTodoDone lorsque la CheckBox est pressée
              />
              {/* Contenu du ListItem */}
              <ListItem.Content>
                {/* Titre du todo */}
                <ListItem.Title style={styles.title}>{todo.title}</ListItem.Title>

                {/* Sous-titre du todo (description) */}
                <ListItem.Subtitle>{todo.description}</ListItem.Subtitle>
              </ListItem.Content>

              {/* TouchableOpacity pour confirmer la suppression du todo */}
              <TouchableOpacity onPress={() => confirmDelete(todo.id)}>
                {/* Icône de suppression */}
                <FontAwesomeIcon icon={faDeleteLeft} size={24} style={{ color: "red", }} />
              </TouchableOpacity>
            </ListItem>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* TouchableOpacity pour créer un nouveau todo, déclenche la navigation vers "CreateTodoScreen" */}
      <TouchableOpacity style={styles.createTodoButton} onPress={() => props.navigation.navigate("CreateTodoScreen")}>
        {/* Icône de cercle plus */}
        <FontAwesomeIcon icon={faCirclePlus} size={64} color="#fff" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

// Styles pour le conteneur principal
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Utilise l'espace disponible en plein écran
    paddingTop: 10,  // Marge supérieure de 10 unités
  },

  // Styles pour le conteneur de recherche
  searchContainer: {
    flexDirection: 'row',  // Disposition en ligne des éléments enfants
    alignItems: 'center',  // Alignement central vertical des éléments enfants
    backgroundColor: '#FFFFFF',  // Couleur de fond blanche
    borderRadius: 20,  // Bordure arrondie avec un rayon de 20 unités
    margin: 20,  // Marge externe de 20 unités
    paddingHorizontal: 10,  // Remplissage horizontal de 10 unités
  },
  // Styles pour le champ de recherche
  searchInput: {
    flex: 1,  // Utilise l'espace disponible
    paddingVertical: 8,  // Remplissage vertical de 8 unités
    paddingHorizontal: 10,  // Remplissage horizontal de 10 unités
    fontSize: 16,  // Taille de police de 16
  },
  // Styles pour le ScrollView (liste de todos)
  scrollView: {
    marginTop: 10,  // Marge supérieure de 10 unités
  },
  // Styles pour le bouton de création de todo
  createTodoButton: {
    position: "absolute",  // Position absolue par rapport à son parent
    right: 30,  // Distance de 30 unités depuis le côté droit
    bottom: 30,  // Distance de 30 unités depuis le bas
  },
  // Styles pour chaque ListItem dans la liste de todos
  listItem: {
    marginHorizontal: 10,  // Marge horizontale de 10 unités
    borderRadius: 10,  // Bordure arrondie avec un rayon de 10 unités
    marginTop: 5,  // Marge supérieure de 5 unités
    paddingVertical: 10,  // Remplissage vertical de 10 unités
  },
  // Styles pour le titre du ListItem
  title: {
    fontWeight: 'bold',  // Texte en gras
    fontSize: 18,  // Taille de police de 18
    marginBottom: 5,  // Marge inférieure de 5 unités (pour créer de l'espace entre le titre et le sous-titre)
  },
});

// Exportation des styles pour utilisation dans d'autres parties de l'application
export default TodoScreen;
