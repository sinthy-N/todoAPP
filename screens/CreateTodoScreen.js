import React, { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,Text, TouchableOpacity
} from "react-native";
import { database, auth } from '../config/firebase';
import { getFirestore, collection, addDoc, onSnapshot , doc , getDoc } from "firebase/firestore";




const AddTodoScreen = (props) => {
  const [state, setState] = useState({
    title : '',
    description: '', // Initialize with an empty string
  });

  const handleChangeText = (value, title) => {
    setState({ ...state, [title]: value });
  };
  

  const saveNewTodo = async () => {
    try {
      if (state.title === "") {
        alert("Please provide a title");
      } else {
          
        const todosCollection = collection( database, 'todos');
        await addDoc(todosCollection, {
          title: state.title,
          description: state.description,
          userId : auth.currentUser.uid,
          
        });

        props.navigation.navigate("TodosList");
  
        // Redirect the user to the "TodosList" screen after successful creation
        // You'll need to pass the navigation prop to this function
      }
    } catch (error) {
      console.log('Error saving new todo:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text></Text>
      </View>
      <View style={styles.input}>
      
          <TextInput
          placeholder ="Titre"
          value ={state.title}
          onChangeText={(value) => handleChangeText(value, "title")}
          
        />
      </View>

      {/* Description Input */}
      <View style={styles.input}>
        <TextInput
          placeholder="Description"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "description")}
          value={state.description}
        />

<Text></Text>
<Text></Text>



      <TouchableOpacity style={styles.button} onPress={saveNewTodo}>
      <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Save To Do </Text>
      </TouchableOpacity>
      </View>


      
    </ScrollView>
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
    marginBottom: 20,
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
    marginTop: 10,
    margin: 85
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

export default AddTodoScreen;