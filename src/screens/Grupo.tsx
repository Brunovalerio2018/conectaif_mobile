import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app";

export default function Grupo() {
  const [token, setToken] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    // Recuperar token armazenado no AsyncStorage
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");
      setToken(storedToken);
    };
    getToken();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    if (token) {
      try {
        const response = await api.get("http://localhost:3335/docs#/grupos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    }
  };



  const deleteGroup = async (groupId: string) => {
    if (token) {
      try {
        await axios.delete(`https://api.exemplo.com/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchGroups(); // Atualiza a lista de grupos
      } catch (error) {
        console.error("Error deleting group", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Grupos</Text>

      {/* Campo para criação de grupo */}
      <TextInput
        style={styles.input}
        placeholder="Nome do Grupo"
        value={groupName}
        onChangeText={setGroupName}
      />
      {/* Lista de grupos existentes */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteGroup(item.id)}>
              <Text style={styles.deleteButton}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  groupName: {
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
  },
});
