import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../config/firebase';
import { reauthenticateWithCredential, sendEmailVerification, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword, deleteUser, signOut } from 'firebase/auth';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';


const UserProfileScreen = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  

  const handleUpdateEmail = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
  
      await reauthenticateWithCredential(auth.currentUser, credential);
  
      // Check if the new email is the same as the current email
      if (newEmail === auth.currentUser.email) {
        Alert.alert('Avertissement', 'Le nouvel email est identique à l\'ancien. Aucune modification n\'a été effectuée.');
        return; // Stop the function execution
      }
  
      // Update email
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
  
      // Send email verification
      await sendEmailVerification(auth.currentUser);
  
      // Email verification sent successfully
      Alert.alert(
        'Succès',
        'Demande de changement d\'adresse électronique envoyée. Veuillez vérifier votre courrier électronique.'
      );
  
      // Rediriger vers la page de connexion après la mise à jour de l'e-mail
      await signOut(auth);
      // Rediriger vers la page de connexion
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Une erreur s\'est produite', 'Assurez-vous de fournir le mot de passe correct pour modifier votre email.' /* + error.message */);
    }
  };
  

  const handleUpdatePassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
  
      await reauthenticateWithCredential(auth.currentUser, credential);
  
      // Check if the new password is the same as the old password
      if (newPassword === password) {
        Alert.alert('Avertissement', 'Le nouveau mot de passe est identique à l\'ancien. Aucune modification n\'a été effectuée.');
        return; // Stop the function execution
      }
  
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Succès', 'Le mot de passe a été mit à jour avec succès.');
      // Déconnecter l'utilisateur après la mise à jour du mot de passe
      await signOut(auth);
      // Rediriger vers la page de connexion
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Une erreur s\'est produite', 'Assurez-vous de fournir le mot de passe correct pour modifier votre mot de passe.' /* + error.message */);
    }
  };
  

  const handleDeleteUser = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      Alert.alert('Succès', 'Compte supprimé avec succès.');
      // Déconnecter l'utilisateur après la suppression du compte
      await signOut(auth);
      // Rediriger vers la page de connexion
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Une erreur s\'est produite', 'Assurez-vous de fournir le mot de passe correct pour supprimer votre compte.' /* + error.message */);
    }


  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title2}>Authentification :</Text>
      <TextInput
        style={styles.input}
        placeholder="Saisir le mot de passe"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Text style={styles.title3}>Votre Email : {auth.currentUser.email}</Text>

      <Text style={styles.title2}>Modifier votre email :</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.emailInput]}
          placeholder="Nouvel email"
          value={newEmail}
          onChangeText={setNewEmail}
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleUpdateEmail}>
          <FontAwesomeIcon icon={faCheck} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title2}>Modifier votre mot de passe :</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.emailInput]}
          placeholder="Nouveau mot de passe"
          onChangeText={setNewPassword}
          textContentType="password"
          secureTextEntry={true}
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.iconButton} onPress={handleUpdatePassword}>
          <FontAwesomeIcon icon={faCheck} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleDeleteUser}>
        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Supprimer votre compte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Use a light background color
    padding: 20, // Add padding for a cleaner look
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#6B36AF",
    alignSelf: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FFFFFF", // Use a white background for inputs
    height: 50,
    marginBottom: 16,
    fontSize: 16,
    borderTopLeftRadius: 10,  // BorderRadius for the top-right corner
    borderBottomLeftRadius: 10,
    paddingHorizontal: 16, // Add horizontal padding for better input appearance
  },
  button: {
    backgroundColor: '#6B36AF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#6B36AF",
    marginBottom: 16,
  },
  title3: {
    fontSize: 15,
    color: "#6B36AF",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, // Mettez à jour ceci pour éliminer l'espace
  },
  emailInput: {
    flex: 1,
  },
  iconButton: {
    backgroundColor: '#6B36AF',
    height: 50,
    width: 50,
    borderTopRightRadius: 10,  // BorderRadius for the top-right corner
    borderBottomRightRadius: 10,  // BorderRadius for the bottom-right corner
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  

});

export default UserProfileScreen;