import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Text } from "react-native";
import { ListItem, CheckBox, Icon } from "react-native-elements";
import { database, auth } from '../config/firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient'; // Assurez-vous d'installer expo-linear-gradient
import { Ionicons } from "@expo/vector-icons";

const TodoScreen = (props) => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, 'todos'), (querySnapshot) => {
      const todosArray = querySnapshot.docs
        .filter(doc => doc.data().userId === auth.currentUser.uid)
        .map(doc => ({ id: doc.id, done: doc.data().done || false, ...doc.data() }));
      setTodos(todosArray);
    });

    return () => unsubscribe();
  }, []);

  const toggleTodoDone = async (todoId, isDone) => {
    const todoRef = doc(database, 'todos', todoId);
    try {
      await updateDoc(todoRef, { done: !isDone });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    const todoRef = doc(database, 'todos', todoId);
    try {
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={['#957DAD', '#D1B3C4']} style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#B1B1B1" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Todos"
          placeholderTextColor="#B1B1B1"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredTodos.map((todo) => (
          <TouchableOpacity key={todo.id} onPress={() => props.navigation.navigate("TodoDetailScreen", { todoId: todo.id })}>
            <ListItem key={todo.id} bottomDivider containerStyle={styles.listItem}>
              <CheckBox
                checked={todo.done}
                onPress={() => toggleTodoDone(todo.id, todo.done)}
              />
              <ListItem.Content>
                <ListItem.Title style={styles.title}>{todo.title}</ListItem.Title>
                <ListItem.Subtitle>{todo.description}</ListItem.Subtitle>
              </ListItem.Content>
              <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <Ionicons name="trash-bin" size={24} color="red" />
              </TouchableOpacity>
            </ListItem>
          </TouchableOpacity>
        ))}
      </ScrollView>


      <TouchableOpacity style={styles.createTodoButton} onPress={() => props.navigation.navigate("CreateTodoScreen")}>
        <Ionicons name="add-circle" size={64} color="#6B36AF" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  scrollView: {
    marginTop: 10,
  },
  createTodoButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
  },
  listItem: {
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default TodoScreen;
