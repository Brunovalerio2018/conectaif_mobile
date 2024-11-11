import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";

// Função para buscar as notificações da API
const fetchNotifications = async () => {
  try {
    // Substitua pela URL real da sua API
    const response = await fetch("http://localhost:3335/docs#/notificacao");
    const data = await response.json();
    return data;  // Retorna as notificações
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }
};

export default function Notificacao = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Exemplo de chamada de API para buscar notificações
    fetch("localhost:3335/docs#/Notificacao")
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error("Erro ao buscar notificações:", error));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.titulo}</Text>
      <Text style={styles.notificationDescription}>{item.descricao}</Text>
    </TouchableOpacity>
  );
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>Ainda não há notificações.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  )
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,  // Ajuste o espaçamento superior
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',  // Cor para o título
  },
  notificationList: {
    width: '90%',
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noNotifications: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});