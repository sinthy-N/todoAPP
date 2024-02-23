import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword, deleteUser } from 'firebase/auth';

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
      await updateEmail(auth.currentUser, newEmail);
      Alert.alert('Success', 'Email updated successfully.');
      // Rediriger vers la page de connexion après la mise à jour réussie
      props.navigation.navigate("Login");
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
      // Rediriger vers la page de connexion après la mise à jour réussie
      props.navigation.navigate("Login");
    } catch (error) {
      Alert.alert('Error', error.message);
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
      Alert.alert('Success', 'Account deleted successfully.');
      // Rediriger vers la page de connexion après la suppression réussie
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Text style={styles.title2}>Authenticate:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Text style={styles.title3}>User Email: {auth.currentUser.email}</Text>

      <Text style={styles.title2}>New email:</Text>
      <TextInput
        style={styles.input}
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Update Email</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        onChangeText={setNewPassword}
        textContentType="password"
        secureTextEntry={true}
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Update Password</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.button} onPress={handleDeleteUser}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginBottom: 5,
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
    marginTop: 0,
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
});

export default UserProfileScreen;