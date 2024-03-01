// Import des modules nécessaires depuis React et React Native
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { auth, database } from '../config/firebase';
import { reauthenticateWithCredential, sendEmailVerification, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { getDocs, query, where, collection, writeBatch, querySnapsho, doc, forEach } from 'firebase/firestore';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

// Importation d'une image depuis le fichier "Purple.jpg"
const Purple = require("../assets/Purple.jpg")


const UserProfileScreen = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update email de l'utilisateur
  const handleUpdateEmail = async () => {
    try {
      // Création d'une instance de credential pour la réauthentification
      // "credential" est créée en utilisant informations actuelles, adresse e-mail et votre mot de passe existants pour prouver que c'est bien tels utilisateur
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      // Réauthentification de l'utilisateur
      // effectuer la réauthentification de l'utilisateur avant de pouvoir modifier ou supprimer
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Vérification si le nouvel e-mail est identique à l'ancien
      if (newEmail === auth.currentUser.email) {
        Alert.alert('Avertissement', 'Le nouvel email est identique à l\'ancien. Aucune modification n\'a été effectuée.');
        return; // Arrête l'exécution de la fonction
      }

      // Mise à jour de l'e-mail
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

      // Envoi de la vérification par e-mail
      await sendEmailVerification(auth.currentUser);

      // Affichage d'une alerte en cas de succès
      Alert.alert(
        'Succès',
        'Demande de changement d\'adresse électronique envoyée. Veuillez vérifier votre courrier électronique.'
      );

      // Déconnexion de l'utilisateur après la mise à jour de l'e-mail 
      await signOut(auth);
      // Redirection vers la page de connexion
      navigation.navigate('Login');
    } catch (error) {
      // Affichage d'une alerte en cas d'erreur
      Alert.alert('Une erreur s\'est produite', 'Assurez-vous de fournir le mot de passe correct pour modifier votre email.');
    }
  };

  // Définition d'une fonction confirmUpdate pour afficher une boîte de dialogue de confirmation de la mise à jour
  const confirmUpdateEmail = () => {

    // Affichage d'une alerte avec les options "Oui" et "Non", et la fonction handleUpdateEmail comme action si "Oui" est sélectionné
    Alert.alert(
      "Modification de votre email", // Titre de l'alerte
      "Êtes-vous sûr ?", // Message de l'alerte
      [
        { text: "Non" }, // Option "Non" de l'alerte
        { text: "Oui", onPress: handleUpdateEmail }, // Option "Oui" de l'alerte avec l'action updateTodo
      ],
      { cancelable: false } // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
    );

  };

  // Update du mot de passe de l'utilisateur
  const handleUpdatePassword = async () => {
    try {
      // Création d'une instance de credential pour la réauthentification
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email, // Utilisation de l'adresse e-mail actuelle de l'utilisateur
        password // Utilisation du mot de passe fourni par l'utilisateur
      );

      // Réauthentification de l'utilisateur en utilisant le credential
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Vérification si le nouveau mot de passe est identique à l'ancien
      if (newPassword === password) {
        // Affichage d'une alerte si le nouveau mot de passe est identique à l'ancien
        Alert.alert('Avertissement', 'Le nouveau mot de passe est identique à l\'ancien. Aucune modification n\'a été effectuée.');
        return; // Arrêt de l'exécution de la fonction
      }

      // Mise à jour du mot de passe de l'utilisateur
      await updatePassword(auth.currentUser, newPassword);
      // Affichage d'une alerte en cas de succès
      Alert.alert('Succès', 'Le mot de passe a été mit à jour avec succès.');

      // Déconnexion de l'utilisateur après la mise à jour du mot de passe
      await signOut(auth);
      // Redirection vers la page de connexion
      navigation.navigate('Login');
    } catch (error) {
      // En cas d'erreur, affichage d'une alerte avec un message d'erreur
      Alert.alert('Une erreur s\'est produite', 'Assurez-vous de fournir le mot de passe correct pour modifier votre mot de passe.');
    }
  };

  // Définition d'une fonction confirmUpdate pour afficher une boîte de dialogue de confirmation de la mise à jour
  const confirmUpdatePassword = () => {

    // Affichage d'une alerte avec les options "Oui" et "Non", et la fonction handleUpdatePassword comme action si "Oui" est sélectionné
    Alert.alert(
      "Modification de votre mot de passe", // Titre de l'alerte
      "Êtes-vous sûr ?", // Message de l'alerte
      [
        { text: "Non" }, // Option "Non" de l'alerte
        { text: "Oui", onPress: handleUpdatePassword }, // Option "Oui" de l'alerte avec l'action updateTodo
      ],
      { cancelable: false } // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
    );
  };


  // Fonction pour gérer la suppression du compte de l'utilisateur avec ses todos
  const handleDeleteUserAndToDos = async () => {
    try {
      // Création d'une instance de credential pour la réauthentification
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email, // Utilisation de l'adresse e-mail actuelle de l'utilisateur
        password // Utilisation du mot de passe fourni par l'utilisateur
      );
      // Ré-authentification de l'utilisateur avec les nouvelles informations d'identification
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Création d'un lot de suppression pour les tâches liées à l'utilisateur
      const batch = writeBatch(database);
      // Crée une requête pour récupérer des documents dans la collection "todos"
      const q = query(
        collection(database, "todos"),
        where("userId", "==", auth.currentUser.uid)
      );
      // Effectuer la requête pour obtenir le querySnapshot
      const querySnapshot = await getDocs(q);
      // Pour chaque document (doc) dans le résultat de la requête (querySnapshot)
      querySnapshot.forEach((doc) => {
        // Ajoute une opération de suppression dans le lot (batch) pour le document actuel (doc)
        batch.delete(doc.ref);
      });

      // Exécution du lot de suppression
      await batch.commit();

      // Suppression du compte de l'utilisateur
      await deleteUser(auth.currentUser);
      // Affichage d'une alerte de succès
      Alert.alert('Succès', 'Compte supprimé avec succès.');
      // Déconnexion de l'utilisateur
      await signOut(auth);
      // Redirection vers l'écran de connexion ('Login') après la suppression réussie du compte
      navigation.navigate('Login');
    } catch (error) {
      // Définit le message d'erreur pour affichage éventuel à l'utilisateur
      setErrorMessage(error.message);
      // Affiche une alerte avec le message d'erreur détaillé
      Alert.alert('Une erreur s\'est produite', error.message);
    }
  };


  const confirmDeleteUser = () => {
    // Affichage d'une alerte avec les options Oui et Non, et la fonction handleDeleteUserAndToDos comme action si Oui est sélectionné
    Alert.alert(
      "Suppression de votre compte", // Titre de l'alerte
      "Êtes-vous sûr ?", // Message de l'alerte
      [
        { text: "Non" }, // Option "Non" de l'alerte
        { text: "Oui", onPress: handleDeleteUserAndToDos }, // Option "Oui" de l'alerte avec l'action handleDeleteUserAndToDos
      ],
      { cancelable: false } // La boîte de dialogue ne peut pas être annulée en appuyant à l'extérieur
    );
  };

  return (
    //ImageBackground avec la source Purple et le style défini dans la variable styles.container
    < ImageBackground source={Purple} style={styles.container} >
      {/* ScrollView avec un style défini dans la variable styles.scrollViewContent */}
      < ScrollView contentContainerStyle={styles.scrollViewContent} >
        {/* Texte pour le titre de l'authentification */}
        < Text style={styles.title2} > Authentification :</Text >
        {/* TextInput pour saisir le mot de passe */}
        < TextInput
          style={styles.authInput}  // Style défini dans la variable styles.authInput
          placeholder="Saisir le mot de passe"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
          autoCapitalize="none"  // Désactive la mise en majuscule automatique
          autoCorrect={false}  // Désactive la correction automatique
          secureTextEntry={true}  // Masque les caractères saisis
          textContentType="password"  // Type de contenu du champ de texte pour le mot de passe
          value={password}  // La valeur du champ est liée à la variable 'password'
          onChangeText={(text) => setPassword(text)}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'password'
        />
        {/* Texte affichant le titre "Votre Email" avec l'email actuel de l'utilisateur */}
        <Text style={styles.title3}>Votre Email: {auth.currentUser.email}</Text>
        {/* Texte pour le titre "Modifier votre email" */}
        <Text style={styles.title2}>Modifier votre email :</Text>
        {/* Vue contenant le champ de saisie et le bouton pour modifier l'email */}
        <View style={styles.inputContainer}>
          {/* TextInput pour saisir le nouvel email */}
          <TextInput
            style={[styles.input, styles.emailInput]}  // Styles définis dans les variables styles.input et styles.emailInput
            placeholder="Nouvel email"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
            value={newEmail}  // La valeur du champ est liée à la variable 'newEmail'
            onChangeText={setNewEmail}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'newEmail'
          />
          {/* TouchableOpacity pour valider la modification de l'email */}
          <TouchableOpacity style={styles.iconButton} onPress={confirmUpdateEmail}>
            {/* Icône de validation */}
            <FontAwesomeIcon icon={faCheck} size={24} color="#fff" />
          </TouchableOpacity>
          {/* Fermeture de la vue précédente */}
        </View>

        {/* Texte pour le titre "Modifier votre mot de passe" */}
        <Text style={styles.title2}>Modifier votre mot de passe :</Text>

        {/* Vue contenant le champ de saisie et le bouton pour modifier le mot de passe */}
        <View style={styles.inputContainer}>
          {/* TextInput pour saisir le nouveau mot de passe */}
          <TextInput
            style={[styles.input, styles.emailInput]}  // Styles définis dans les variables styles.input et styles.emailInput
            placeholder="Nouveau mot de passe"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
            onChangeText={setNewPassword}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'newPassword'
            textContentType="password"  // Type de contenu du champ de texte pour le mot de passe
            secureTextEntry={true}  // Masque les caractères saisis
            autoCorrect={false}  // Désactive la correction automatique
          />
          {/* TouchableOpacity pour valider la modification du mot de passe */}
          <TouchableOpacity style={styles.iconButton} onPress={confirmUpdatePassword}>
            {/* Icône de validation */}
            <FontAwesomeIcon icon={faCheck} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* TouchableOpacity pour supprimer le compte de l'utilisateur, déclenche la fonction handleDeleteUser */}
        <TouchableOpacity style={styles.button} onPress={confirmDeleteUser}>
          {/* Texte stylisé dans le bouton */}
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Supprimer votre compte</Text>
        </TouchableOpacity>
        {/* Fermeture du ScrollView et de l'ImageBackground */}
      </ScrollView>
    </ImageBackground>
  );
};

// Styles pour le conteneur principal
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Utilise l'espace disponible en plein écran
    padding: 20,  // Ajoute du rembourrage pour un aspect plus propre
  },
  // Styles pour le champ de saisie d'authentification
  authInput: {
    backgroundColor: "#FFFFFF",  // Couleur de fond blanche
    height: 50,  // Hauteur de 50 unités
    marginBottom: 16,  // Marge inférieure de 16 unités
    fontSize: 16,  // Taille de police de 16
    borderRadius: 10,  // Bordure arrondie avec un rayon de 10 unités
    paddingHorizontal: 16,  // Remplissage horizontal de 16 unités
  },
  // Styles pour le champ de saisie d'authentification
  input: {
    backgroundColor: "#FFFFFF",  // Couleur de fond blanche
    height: 50,  // Hauteur de 50 unités
    marginBottom: 16,  // Marge inférieure de 16 unités
    fontSize: 16,  // Taille de police de 16
    borderTopLeftRadius: 10,  // Bordure arrondie pour le coin supérieur gauche
    borderBottomLeftRadius: 10,  // Bordure arrondie pour le coin inférieur gauche
    paddingHorizontal: 16,  // Remplissage horizontal de 16 unités
  },
  // Styles pour le bouton
  button: {
    backgroundColor: '#FF5252',  // Couleur de fond rouge
    height: 50,  // Hauteur de 50 unités
    borderRadius: 10,  // Bordure arrondie avec un rayon de 10 unités
    justifyContent: 'center',  // Centrage vertical du contenu
    alignItems: 'center',  // Centrage horizontal du contenu
    marginTop: 16,  // Marge supérieure de 16 unités
  },
  // Styles pour le texte du bouton
  buttonText: {
    fontWeight: 'bold',  // Texte en gras
    color: '#FFFFFF',  // Couleur du texte blanche
    fontSize: 18,  // Taille de police de 18
  },
  // Styles pour le titre2
  title2: {
    fontSize: 20,  // Taille de police de 20
    fontWeight: 'bold',  // Texte en gras
    color: "#fff",  // Couleur du texte blanche
    marginBottom: 16,  // Marge inférieure de 16 unités
  },
  // Styles pour le titre3
  title3: {
    fontSize: 15,  // Taille de police de 15
    color: "#fff",  // Couleur du texte blanche
    marginBottom: 16,  // Marge inférieure de 16 unités
  },
  // Styles pour le conteneur d'entrée
  inputContainer: {
    flexDirection: 'row',  // Disposition en ligne des éléments enfants
    alignItems: 'center',  // Alignement central vertical des éléments enfants
    marginBottom: 0,  // Marge inférieure de 0 unité (peut être mise à jour selon les besoins)
  },
  // Styles pour le champ d'entrée d'email
  emailInput: {
    flex: 1,  // Utilise l'espace disponible
  },
  // Styles pour le bouton avec une icône
  iconButton: {
    backgroundColor: '#4CAF50',  // Couleur de fond verte
    height: 50,  // Hauteur de 50 unités
    width: 50,  // Largeur de 50 unités
    borderTopRightRadius: 10,  // Bordure arrondie pour le coin supérieur droit
    borderBottomRightRadius: 10,  // Bordure arrondie pour le coin inférieur droit
    justifyContent: 'center',  // Centrage vertical du contenu
    alignItems: 'center',  // Centrage horizontal du contenu
    marginBottom: 16,  // Marge inférieure de 16 unités
  },
});

// Exportation des styles pour utilisation dans d'autres parties de l'application
export default UserProfileScreen;