import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";

// Importation des fonctions d'authentification depuis Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Importation de l'instance d'authentification configurée dans Firebase
import { auth } from '../config/firebase';

// Chargement d'une image depuis les assets pour l'utiliser comme arrière-plan
const Purple = require("../assets/Purple.jpg")

// Définition du composant Signup qui prend 'navigation' comme prop pour la navigation entre écrans
export default function Signup({ navigation }) {

  // Définition des états locaux pour l'email et le mot de passe
  // Déclaration d'un état `email` avec une fonction `setEmail` pour mettre à jour sa valeur
  const [email, setEmail] = useState('');
  // Déclaration d'un état `password` avec une fonction `setPassword` pour mettre à jour sa valeur
  const [password, setPassword] = useState('');

  // Fonction appelée lors du clic sur le bouton d'inscription
  const onHandleSignup = () => {
    // Vérifie que les champs email et password ne sont pas vides
    if (email !== '' && password !== '') {
      // Crée un utilisateur avec email et mot de passe via Firebase Auth
      createUserWithEmailAndPassword(auth, email, password)
        // En cas de succès, affichage d'un message dans la console
        .then(() => console.log('Inscription réussie'))
        // En cas d'erreur, affichage d'une alerte avec un message d'erreur
        .catch((err) => Alert.alert("Erreur d'inscription", "Veuillez réessayer."));
    }
  };

  // Rendu du composant Signup, incluant l'image de fond, les champs de saisie, et le bouton d'inscription
  return (
    // Vue principale du composant avec le style défini dans la variable styles.container
    <View style={styles.container}>
      {/* Image d'arrière-plan avec la source définie dans la variable Purple et le style dans la variable styles.backImage */}
      <Image source={Purple} style={styles.backImage} />
      {/* Vue blanche servant de fond, avec le style défini dans la variable styles.whiteSheet */}
      <View style={styles.whiteSheet} />
      {/* Zone de sécurité pour le contenu avec le style défini dans la variable styles.form */}
      <SafeAreaView style={styles.form}>
        {/* Texte affichant "S'inscrire" avec le style défini dans la variable styles.title */}
        <Text style={styles.title}>S'inscrire</Text>
        {/* Champ de saisie de texte pour l'email avec les propriétés et le style définis */}
        <TextInput
          style={styles.input}  // Style du champ de saisie défini dans la variable styles.input
          placeholder="Saisir un email"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
          autoCapitalize="none"  // Désactivation de la capitalisation automatique
          keyboardType="email-address"  // Type de clavier spécifique pour les adresses e-mail
          textContentType="emailAddress"  // Type de contenu du texte pour les adresses e-mail
          autoFocus={true}  // Activation automatique du focus sur ce champ lors du rendu initial
          value={email}  // La valeur du champ est liée à la variable 'email', permettant de contrôler son contenu
          onChangeText={(text) => setEmail(text)}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'email'
        />
        {/* Champ de saisie de texte pour le mot de passe avec les propriétés et le style définis */}
        <TextInput
          style={styles.input}  // Style du champ de saisie défini dans la variable styles.input
          placeholder="Saisir un mot de passe"  // Texte indicatif affiché avant que l'utilisateur ne saisisse quelque chose
          autoCapitalize="none"  // Désactivation de la capitalisation automatique
          autoCorrect={false}  // Désactivation de la correction automatique
          secureTextEntry={true}  // Masquage des caractères pour assurer la confidentialité du mot de passe
          textContentType="password"  // Type de contenu du texte pour les mots de passe
          value={password}  // La valeur du champ est liée à la variable 'password', permettant de contrôler son contenu
          onChangeText={(text) => setPassword(text)}  // Fonction appelée lorsqu'il y a un changement dans le champ de texte, mettant à jour la variable 'password'
        />

        {/* Bouton tactile avec le style défini dans la variable styles.button, et appel de la fonction onHandleSignup lorsqu'il est pressé */}
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> S'inscrire</Text>
        </TouchableOpacity>
        {/* Vue contenant deux textes et deux boutons tactiles alignés horizontalement */}
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          {/* Texte indiquant la possibilité de se connecter */}
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Vous avez déjà un compte ? </Text>
          {/* Bouton tactile qui, lorsqu'il est pressé, navigue vers l'écran de connexion */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: '#6B36AF', fontWeight: '600', fontSize: 14 }}> Se connecter</Text>
          </TouchableOpacity>
        </View>

        {/* Zone de sécurité pour le contenu avec le style défini dans la variable styles.form */}
      </SafeAreaView>

      {/* Barre d'état en haut de l'écran avec le style de barre défini sur "light-content" */}
      <StatusBar barStyle="light-content" />

      {/* Fin de la vue principale du composant */}
    </View>

  );
}

// Stylesheet pour le composant Signup
// Définition des styles à l'aide de StyleSheet.create
const styles = StyleSheet.create({
  // Style de la vue principale du composant
  container: {
    flex: 1,  // Utilisation de tout l'espace disponible
    backgroundColor: "#fff",  // Couleur de fond blanche
  },
  // Style du titre
  title: {
    fontSize: 36,  // Taille de la police
    fontWeight: 'bold',  // Graisse de la police
    color: "#6B36AF",  // Couleur violette
    alignSelf: "center",  // Alignement au centre
    paddingBottom: 20,  // Espace en bas du titre
    paddingTop: 20,  // Espace en haut du titre
  },
  // Style du champ de saisie
  input: {
    backgroundColor: "#F6F7FB",  // Couleur de fond
    height: 58,  // Hauteur du champ
    fontSize: 16,  // Taille de la police
    borderRadius: 10,  // Bordure arrondie
    padding: 12,  // Espace intérieur
    marginBottom: 10,  // Marge en bas
  },
  // Style de l'image d'arrière-plan
  backImage: {
    width: "100%",  // Largeur à 100%
    height: 340,  // Hauteur fixe
    position: "absolute",  // Position absolue
    top: 0,  // Aligné en haut
    resizeMode: 'cover',  // Redimensionner pour couvrir toute la zone
  },
  // Style de la vue blanche servant de fond
  whiteSheet: {
    width: '100%',  // Largeur à 100%
    height: '75%',  // Hauteur à 75% de la vue parente
    position: "absolute",  // Position absolue
    bottom: 0,  // Aligné en bas
    backgroundColor: '#fff',  // Couleur de fond blanche
    borderTopLeftRadius: 60,  // Bordure arrondie en haut à gauche
  },
  // Style de la zone de formulaire
  form: {
    flex: 1,  // Utilisation de tout l'espace disponible
    justifyContent: 'center',  // Alignement central vertical
    marginHorizontal: 30,  // Marge horizontale
  },
  // Style du bouton
  button: {
    backgroundColor: "#6B36AF",  // Couleur de fond violette
    height: 58,  // Hauteur du bouton
    borderRadius: 10,  // Bordure arrondie
    justifyContent: 'center',  // Alignement central vertical
    alignItems: 'center',  // Alignement central horizontal
    marginTop: 40,  // Marge en haut
  },

});