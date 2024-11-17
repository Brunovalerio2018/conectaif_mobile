import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Componente de Calendário
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';

// Tipo de dados das reuniões
type Reuniao = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
};

export default function Reunioes() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Para busca de reuniões
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Data selecionada no calendário
  const [markedDates, setMarkedDates] = useState<any>({}); // Para marcar as datas com eventos

  // Função para buscar as reuniões da API
  const fetchReunioes = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get(`/reunioes`); // Supondo que a API tenha uma rota para as reuniões
      const data = await response.data;

      if (data) {
        setReunioes(
          data.map((reuniao: any) => ({
            id: reuniao.id,
            titulo: reuniao.titulo || "",
            descricao: reuniao.descricao || "",
            data: reuniao.data || "",
            status: reuniao.status || "Pendente", // Exemplo de status
          }))
        );

        // Atualiza as datas marcadas com base nas reuniões
        const newMarkedDates: any = {};
        data.forEach((reuniao: any) => {
          newMarkedDates[reuniao.data] = {
            marked: true,
            selected: false,
            dotColor: 'red', // Cor do ponto, por exemplo, para eventos
            selectedColor: 'green', // Cor de seleção
          };
        });
        setMarkedDates(newMarkedDates);
      } else {
        console.log("Erro ao buscar reuniões:", data.message);
      }
    } catch (error) {
      console.log("Erro ao buscar reuniões:", error);
    }
  };

  // Função para buscar o token na AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken); // Atualiza o estado do token
    };

    getToken();
  }, []); // A dependência está vazia para buscar o token uma vez ao carregar o componente

  // Quando o token for obtido, buscar as reuniões
  useEffect(() => {
    if (tokenAcess) {
      console.log("Token encontrado:", tokenAcess);
      fetchReunioes(tokenAcess); // Carregar as reuniões ao ter o token
    } else {
      console.log("Token não encontrado");
    }
  }, [tokenAcess]); // Dependência de tokenAcess para atualizar as reuniões

  // Função para filtrar as reuniões conforme a busca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Função para renderizar os itens da lista de reuniões
  const renderReuniaoItem = ({ item }: { item: Reuniao }) => (
    <View style={styles.reuniaoItem}>
      <Text style={styles.reuniaoTitle}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Data: ${item.data}`}</Text>
      <Text>{`Status: ${item.status}`}</Text>
      <Button title="Ver Detalhes" onPress={() => {/* Navegar para tela de detalhes da reunião */}} />
    </View>
  );

  // Função para filtrar as reuniões pela data selecionada no calendário
  const filterByDate = (date: string) => {
    setSelectedDate(date);
    return reunioes.filter(reuniao => reuniao.data === date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário de Reuniões</Text>

      {/* Componente de Calendário */}
      <Calendar
        onDayPress={(day: { dateString: string; }) => {
          console.log("Data selecionada:", day.dateString);
          filterByDate(day.dateString); // Filtra reuniões pela data selecionada
        }}
        markedDates={markedDates} // Marca as datas que possuem eventos
        theme={{
          selectedDayBackgroundColor: 'green',
          selectedDayTextColor: 'white',
          todayTextColor: 'green',
          arrowColor: 'green',
          monthTextColor: 'green',
          textSectionTitleColor: 'green',
          textDayFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontWeight: 'bold',
          textMonthFontSize: 20,
        }}
      />

      {/* Campo de busca de reuniões */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar reunião..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Lista de reuniões filtradas */}
      <FlatList
        data={reunioes.filter((reuniao) => 
          reuniao.titulo.toLowerCase().includes(searchQuery.toLowerCase()) && 
          (selectedDate ? reuniao.data === selectedDate : true)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderReuniaoItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 4,
  },
  reuniaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reuniaoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
