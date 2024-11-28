import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import "moment/locale/pt-br";
import api from "../app";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
}

export default function Notificacao() {

    const [ocorrencias, setOcorrencias] = useState<Notificacao[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [tokenAcess, setTokenAcess] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<any>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

          useEffect(() => {
            const getToken = async () => {
              const storedToken = await AsyncStorage.getItem("userToken");
              setTokenAcess(storedToken);
            };
            getToken();
          }, []);

            useEffect(() => {
              if (tokenAcess) {
                fetchOcorrencias(tokenAcess);
                // Enviar automaticamente a notificação como visualizada
                markAsVisualizada(tokenAcess);
              }
            }, [tokenAcess]);

  const fetchOcorrencias = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.post("/notificacao");
      const data = response.data;

      if (data) {
        setOcorrencias(data);
        const newMarkedDates: any = {};
        data.forEach((ocorrencia: any) => {
          newMarkedDates[ocorrencia.data] = {
            marked: true,
            dotColor: "red",
          };
        });
        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
    }
  };

  const markAsVisualizada = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await await api.get("/visualizada");
      const data = response.data;
      if (data) {
        setOcorrencias(data);
        const newMarkedDates: any = {};
        data.forEach((ocorrencia: any) => {
          newMarkedDates[ocorrencia.data] = {
            marked: false,
            dotColor: "red",
          };
        });
        console.log("Notificação foi visualizada.");
        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como visualizada:", error);

  };
}

  const filterByDate = (date: string) => {
    setSelectedDate(date);
    return ocorrencias.filter((ocorrencia) => ocorrencia.data === date);
  };

  const renderOcorrencia = ({ item }: { item: Notificacao }) => (
    <View style={styles.ocorrenciaItem}>
      <Text style={styles.ocorrenciaTitle}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Data: ${item.data}`}</Text>
      <Text>{`Status: ${item.status}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Calendário */}
      <CalendarPicker
        onDateChange={(date: any) => {
          const selected = moment(date).format("YYYY-MM-DD");
          filterByDate(selected);
        }}
        weekdays={["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]}
        months={[
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
        ]}
        todayTextStyle={{ color: "#7CFC00" }}
        selectedDayColor="green"
        selectedDayTextColor="white"
        todayBackgroundColor="green"
        customDatesStyles={Object.keys(markedDates).map((date) => ({
          date: moment(date, "YYYY-MM-DD").toDate(),
          style: { backgroundColor: "red" },
          textStyle: { color: "white" },
        }))}
        previousTitle="Anterior"
        nextTitle="Próximo"
      />

      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ocorrências..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Lista de Ocorrências */}
      <FlatList
        data={ocorrencias.filter(
          (ocorrencia) =>
            ocorrencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedDate ? ocorrencia.data === selectedDate : true)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderOcorrencia}
        ListEmptyComponent={<Text style={styles.noOcorrencias}>Nenhuma ocorrência encontrada</Text>}
        />
       </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#359830",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  ocorrenciaItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  ocorrenciaTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noOcorrencias: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#999",
  },
});
