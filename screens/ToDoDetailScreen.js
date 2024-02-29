// Import des composants et bibliothèques nécessaires depuis React, React Native, Firebase, etc.
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { database } from "../config/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

// Importation d'une image depuis le fichier "Purple.jpg"
const Purple = require("../assets/Purple.jpg")

// Définition du composant principal TodoDetailScreen
const TodoDetailScreen = (props) => {
  // État initial d'une tâche (todo)
  const initialState = {
    id: "",
    title: "",
    description: "",
  };

  // États du composant
  const [todo, setTodo] = useState(initialState); // Todo actuelle
  const [loading, setLoading] = useState(true); // Chargement en cours
  const [isModified, setIsModified] = useState(false); // Indique si la tâche a été modifiée

  // Définition d'une fonction nommée handleTextChange pour gérer les changements de texte dans les champs de saisie
  const handleTextChange = (value, prop) => {
    // Mise à jour de l'état todo en créant un nouvel objet avec les propriétés existantes et la nouvelle valeur
    setTodo({ ...todo, [prop]: value });
    // Mise à jour de l'état isModified à true, indiquant qu'une modification a été effectuée
    setIsModified(true);
  };

  // Définition d'une fonction asynchrone nommée getTodoById qui prend un ID en paramètre
  const getTodoById = async (id) => {
    // Création d'une référence à un document dans la collection 'todos' avec l'ID fourni
    const dbRef = doc(database, 'todos', id);
    // Récupération des données du document asynchronement
    const docSnap = await getDoc(dbRef);
    // Vérification si le document existe dans la base de données
    if (docSnap.exists()) {
      // Mise à jour de l'état todo avec les données du document et l'ajout de l'ID
      setTodo({ ...docSnap.data(), id: docSnap.id });
      // Changement de l'état loading à false, indiquant que le chargement est terminé
      setLoading(false);
    } else {
      // Affichage d'une alerte si le document n'est pas trouvé
      Alert.alert("Document not found");
    }
  };

  // Définition d'une fonction asynchrone deleteTodo pour supprimer une tâche
  const deleteTodo = async () => {
    // Création d'une référence au document à supprimer dans la collection 'todos' avec l'ID de la tâche actuelle
    const dbRef = doc(database, 'todos', todo.id);
    // Suppression asynchrone du document
    await deleteDoc(dbRef);
    // Navigation vers la liste des tâches après la suppression
    props.navigation.navigate("TodosList");
  };

  // Définition d'une fonction confirmDelete pour afficher une boîte de dialogue de confirmation de suppression
  const confirmDelete = () => {
    // Affichage d'une alerte avec les options Oui et Non, et la fonction deleteTodo comme action si Oui est sélectionné
    Alert.alert(
      "Suppression de la Todo", // Titre de l'alerte
      "Êtes-vous sûr ?", // Message de l'alerte
      [
        { text: "Non" }, // Option "Non" de l'alerte
        { text: "Oui", onPress: deleteTodo }, // Option "Oui" de l'alerte avec l'action deleteTodo
      ],
      { cancelable: false } // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
    );
  };

  // Définition d'une fonction asynchrone updateTodo pour mettre à jour une tâche
  const updateTodo = async () => {
    // Création d'une référence au document à mettre à jour dans la collection 'todos' avec l'ID de la tâche actuelle
    const dbRef = doc(database, 'todos', todo.id);
    // Vérification si le titre de la tâche est vide après suppression des espaces
    if (todo.title.trim() === "") {
      // Affichage d'une alerte en cas d'erreur avec un titre vide
      Alert.alert("Erreur", "Veuillez fournir un titre non vide.");
    }
    else {
      // Mise à jour asynchrone du document dans la base de données avec les nouvelles valeurs du titre et de la description
      await updateDoc(dbRef, {
        title: todo.title, // Mise à jour du titre avec la nouvelle valeur
        description: todo.description, // Mise à jour de la description avec la nouvelle valeur
      }
      )
      // Réinitialisation de l'état isModified à false
      setIsModified(false);
      // Navigation vers la liste des tâches après la mise à jour
      props.navigation.navigate("TodosList");
    };

  };

  // Définition d'une fonction confirmUpdate pour afficher une boîte de dialogue de confirmation de la mise à jour
  const confirmUpdate = () => {
    // Vérification si des modifications ont été apportées (isModified est true)
    if (isModified) {
      // Affichage d'une alerte avec les options "Oui" et "Non", et la fonction updateTodo comme action si "Oui" est sélectionné
      Alert.alert(
        "Modification de la Todo", // Titre de l'alerte
        "Êtes-vous sûr ?", // Message de l'alerte
        [
          { text: "Non" }, // Option "Non" de l'alerte
          { text: "Oui", onPress: updateTodo }, // Option "Oui" de l'alerte avec l'action updateTodo
        ],
        { cancelable: false } // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
      );
    } else {
      // Affichage d'une alerte indiquant qu'aucune modification n'a été apportée sur la Todo
      Alert.alert("Aucun changement", "Aucune modification n'a été apportée sur la Todo.");
    }
  };


  // Effet secondaire pour charger les détails de la tâche au montage du composant
  useEffect(() => {
    getTodoById(props.route.params.todoId); // Appel de la fonction getTodoById pour récupérer les détails de la tâche
  }, []);

  // Vérification si le chargement est toujours en cours
  if (loading) {
    // Rendu d'un composant d'indicateur de chargement s'il est encore en cours
    return (
      //Affichage d'un composant View avec le style loader 
      <View style={styles.loader}>
        {/* Utilisation de l'indicateur d'activité avec une taille large et une couleur gris foncé */}
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ImageBackground source={Purple} style={styles.container}>
      {/* Utilisation du composant ScrollView avec le style défini dans styles.scrollViewContent */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Conteneur pour les champs de saisie */}
        <View style={styles.inputGroup}>
          {/* Champ de saisie pour le titre de la tâche */}
          <TextInput
            placeholder="Title" // Placeholder pour le champ de saisie
            placeholderTextColor="#666" // Couleur du texte de l'indicateur de champ
            value={todo.title} // Valeur du champ de saisie provenant de l'état todo
            onChangeText={(value) => handleTextChange(value, "title")} // Gestion des changements de texte avec la fonction handleTextChange
            style={styles.input} // Style du champ de saisie défini dans styles.input
          />
          {/* Ligne de séparation entre les champs de saisie */}
          <View style={styles.border} />
          {/* Champ de saisie pour la description de la tâche */}
          <TextInput
            placeholder="Description" // Placeholder pour le champ de saisie
            placeholderTextColor="#666" // Couleur du texte de l'indicateur de champ
            multiline={true} // Autorisation de plusieurs lignes dans le champ de saisie
            numberOfLines={4} // Nombre de lignes affichées par défaut
            value={todo.description} // Valeur du champ de saisie provenant de l'état todo
            onChangeText={(value) => handleTextChange(value, "description")}  // Gestion des changements de texte avec la fonction handleTextChange
            style={[styles.input, styles.inputDescription]} // Style du champ de saisie défini dans styles.input et styles.inputDescription
          />
        </View>
        {/* Bouton pour effectuer la mise à jour de la tâche */}
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={confirmUpdate}>
          {/* Affichage d'un composant texte avec le style buttonTexte */}
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        {/* Bouton pour confirmer la suppression de la tâche avec une icône FontAwesome */}
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
          {/* Utilisation de l'icône FontAwesome avec le style spécifié */}
          <FontAwesomeIcon icon={faTrash} size={24} style={{ color: "#fff", }} />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Style du conteneur principal du composant
  container: {
    flex: 1, // Utilisation de tout l'espace disponible
    padding: 35, // Marge intérieure de 35 unités sur tous les côtés
    backgroundColor: "#fff", // Fond blanc
  },
  // Style de l'indicateur de chargement
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute", // Position absolue pour couvrir l'écran
    alignItems: "center", // Centrer horizontalement
    justifyContent: "center", // Centrer verticalement
  },
  // Style générique des boutons
  button: {
    marginTop: 16, // Marge supérieure de 16 unités
    marginBottom: 16, // Marge inférieure de 16 unités
    fontSize: 16, // Taille de police de 16
    borderRadius: 10, // Bord arrondi avec un rayon de 10 unités
    height: 50, // Hauteur de 50 unités
    width: '100%', // Largeur de 100%, adaptée à la largeur parente
    justifyContent: 'center', // Centrer le contenu verticalement
    alignItems: 'center', // Centrer le contenu horizontalement
    alignSelf: 'center', // Centrer le bouton horizontalement dans le parent
  },
  // Style spécifique au bouton de mise à jour
  buttonText: {
    color: "#fff", // Couleur du texte en blanc
    fontSize: 20, // Taille de police de 20
    fontWeight: "bold", // Texte en gras
  },
  // Style spécifique au bouton de mise à jour
  updateButton: {
    backgroundColor: '#E1AD01', // Couleur jaune 
    marginBottom: 8, // Marge inférieure de 8 unités
  },
  // Style spécifique au bouton de suppression
  deleteButton: {
    backgroundColor: '#FF5252', // Couleur rouge en exemple
    marginTop: 8, // Marge supérieure de 8 unités

  },
  // Style du groupe de champs de saisie
  inputGroup: {
    backgroundColor: "#FFFFFF", // Fond blanc
    borderRadius: 10, // Bord arrondi avec un rayon de 10 unités
    padding: 15, // Marge intérieure de 15 unités
    fontSize: 16, // Taille de police de 16
    marginTop: 10, // Marge supérieure de 10 unités
    shadowColor: "#000", // Couleur de l'ombre
    shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre
    shadowOpacity: 0.25, // Opacité de l'ombre
    shadowRadius: 3.84, // Rayon de l'ombre
    elevation: 5, // Élévation de la vue
  },
  // Style de la ligne de séparation entre les champs de saisie
  border: {
    borderBottomWidth: 1, // Largeur de la bordure inférieure de 1 unité
    borderBottomColor: '#ccc', // Couleur grise pour la bordure inférieure
    marginHorizontal: -15, // Marge horizontale de -15 unités pour compenser le padding du inputGroup
    marginTop: 10, // Marge supérieure de 10 unités
  },
});

export default TodoDetailScreen;