import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';

// Tipo de dados das notificações
type Notificacao = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
};

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Função para buscar as notificações da API
  const fetchNotificacoes = useCallback(async (tokenAcess: string) => {
    try {
      setLoading(true);
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get('/notificacao'); 
      const data = response.data;

      if (data) {
        setNotificacoes(data.map((notificacao: any) => ({
          id: notificacao.id,
          titulo: notificacao.titulo || "",
          descricao: notificacao.descricao || "",
          data: notificacao.data || "",
          status: notificacao.status || "Pendente",
        })));

        const newMarkedDates: any = {};
        data.forEach((notificacao: any) => {
          newMarkedDates[notificacao.data] = {
            marked: true,
            selected: false,
            dotColor: 'blue',
            selectedColor: 'orange',
          };
        });
        setMarkedDates(newMarkedDates);
      } else {
        console.error("Erro ao buscar notificações:", data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar o token na AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken); 
    };

    getToken();
  }, []);

  // Quando o token for obtido, buscar as notificações
  useEffect(() => {
    if (tokenAcess) {
      fetchNotificacoes(tokenAcess);
    } else {
      console.error("Token não encontrado");
    }
  }, [tokenAcess, fetchNotificacoes]);

  // Função para filtrar as notificações conforme a busca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Função para renderizar os itens da lista de notificações
  const renderNotificacaoItem = ({ item }: { item: Notificacao }) => (
    <View style={styles.notificacaoItem}>
      <Text style={styles.notificacaoTitle}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Data: ${item.data}`}</Text>
      <Text>{`Status: ${item.status}`}</Text>
      <Button title="Ver Detalhes" onPress={() => {/* Navegar para tela de detalhes */}} />
    </View>
  );

  // Função para filtrar as notificações pela data selecionada no calendário
  const filterByDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>


      {/* Componente de Calendário */}
      <Calendar
        onDayPress={(day: { dateString: string }) => {
          console.log("Data selecionada:", day.dateString);
          filterByDate(day.dateString);
        }}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: 'orange',
          selectedDayTextColor: 'white',
          todayTextColor: 'blue',
          arrowColor: 'blue',
          monthTextColor: 'blue',
          textSectionTitleColor: 'green',
          textDayFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontWeight: 'bold',
          textMonthFontSize: 20,
        }}
      />

      {/* Campo de busca de notificações */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notificação..."
        value={searchQuery}
        onChangeText={handleSearch}
        accessibilityLabel="Campo de busca de notificações"
        accessibilityHint="Digite para buscar notificações"
      />

      {/* Indicador de carregamento */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Lista de notificações filtradas */}
      <FlatList
        data={notificacoes.filter((notificacao) =>
          notificacao.titulo.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedDate ? notificacao.data === selectedDate : true)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificacaoItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação encontrada</Text>}
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
  notificacaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificacaoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});
