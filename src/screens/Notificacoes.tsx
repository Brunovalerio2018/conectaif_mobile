import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Calendar } from "react-native-calendars"; // Componente de Calendário
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app"; // Ajuste o caminho conforme necessário
import * as Notifications from "expo-notifications"; // Usando Expo Notifications

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  data: string; // Data da notificação
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Data selecionada no calendário
  const [markedDates, setMarkedDates] = useState<any>({}); // Para marcar as datas com notificações
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);

  // Função para buscar notificações da API
  const fetchNotificacoes = async () => {
    try {
      if (!tokenAcess) {
        Alert.alert("Erro", "Token de acesso não encontrado.");
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/notificacao"); // Endpoint que buscar as notificações
      const data = await response.data;

      if (data) {
        setNotificacoes(data);

        // Atualiza as datas marcadas com base nas notificações
        const newMarkedDates: any = {};
        data.forEach((notificacao: any) => {
          newMarkedDates[notificacao.data] = {
            marked: true,
            dotColor: "red", // ponto das notificacoes na cor vermelha
          };
        });
        setMarkedDates(newMarkedDates);
      } else {
        console.log("Erro ao buscar notificações:", data.message);
      }
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Falha ao buscar as notificações.");
    }
  };

  // Carregar o token de acesso do AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setTokenAcess(token ?? null);
      } catch (error) {
        console.error("Erro ao obter o token:", error);
      }
    };

    getToken();
  }, []);

  // Quando o token for carregado, buscar as notificações
  useEffect(() => {
    if (tokenAcess) {
      fetchNotificacoes();
    }
  }, [tokenAcess]);

  // Função para lidar com o recebimento de notificações
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const { data } = notification.request.content;
      if (data && data.date) {
        // Quando a notificação contém uma data
        const newMarkedDates = { ...markedDates };
        newMarkedDates[data.date] = {
          marked: true,
          dotColor: "blue", // Cor do ponto para a nova notificação
        };
        setMarkedDates(newMarkedDates);
      }
    });

    return () => {
      subscription.remove(); // Limpa a inscrição quando o componente for desmontado
    };
  }, [markedDates]);

  const renderNotificacaoItem = ({ item }: { item: Notificacao }) => (
    <View style={styles.notificacaoItem}>
      <Text style={styles.notificacaoTitle}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Data: ${item.data}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      {/* Componente de Calendário */}
      <Calendar
        onDayPress={(day: { dateString: string; }) => {
          console.log("Data selecionada:", day.dateString);
          setSelectedDate(day.dateString); // Atualiza a data selecionada
        }}
        markedDates={markedDates} // Marca as datas que possuem notificações
        theme={{
          selectedDayBackgroundColor: "green",
          selectedDayTextColor: "white",
          todayTextColor: "green",
          arrowColor: "green",
          monthTextColor: "green",
          textSectionTitleColor: "green",
          textDayFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontWeight: "bold",
          textMonthFontSize: 20,
        }}
      />

      {/* Lista de notificações */}
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificacaoItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 4,
  },
  notificacaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificacaoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
