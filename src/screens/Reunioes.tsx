import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';
import moment from 'moment';
import 'moment/locale/pt-br';

interface ReuniaoInfo {
  data: string;
  motivo: string;
  idservidor: number;
  idnotificacao: number;
}

export default function Reunioes() {
  const [reunioes, setReunioes] = useState<ReuniaoInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        setTokenAcess(storedToken);
      } catch (error) {
        console.error('Erro ao recuperar token:', error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcess) {
      console.log('Token encontrado:', tokenAcess);
      fetchReunioes(tokenAcess);
    }
  }, [tokenAcess]);

  const fetchReunioes = async (token: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await api.get<ReuniaoInfo[]>('/reuniao');
      const data = response.data;

      if (data) {
        setReunioes(data);

        const newMarkedDates: any = {};
        data.forEach((reuniao) => {
          const dateKey = moment(reuniao.data).format('YYYY-MM-DD');
          newMarkedDates[dateKey] = {
            marked: true,
            dotColor: 'red',
            selectedColor: 'green',
          };
        });
        setMarkedDates(newMarkedDates);
      } else {
        Alert.alert('Erro', 'Erro ao buscar reuniões. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as reuniões. Verifique sua conexão e tente novamente.');
    }
  };

  const filterByDate = (date: string) => {
    setSelectedDate(date);
    return reunioes.filter((reuniao) => moment(reuniao.data).isSame(date, 'day'));
  };

  return (
    <View style={styles.container}>
      {/* Calendário */}
      <View style={styles.calendarWrapper}>
        <CalendarPicker
          onDateChange={(date) => {
            const selectedDate = moment(date).format('YYYY-MM-DD');
            console.log('Data selecionada:', selectedDate);
            filterByDate(selectedDate);
          }}
          weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
          months={[
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
          ]}
          todayTextStyle={{ color: '#7CFC00' }}
          selectedDayColor="green"
          selectedDayTextColor="white"
          todayBackgroundColor="green"
          markedDates={markedDates}
          previousTitle="Anterior"
          nextTitle="Próximo"
        />
      </View>

      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar reunião..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Lista de reuniões */}
      <FlatList
        data={reunioes.filter(
          (reuniao) =>
            reuniao.motivo.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedDate ? moment(reuniao.data).isSame(selectedDate, 'day') : true)
        )}
        keyExtractor={(item) => `${item.idservidor}-${item.idnotificacao}`}
        renderItem={({ item }) => (
          <View style={styles.reuniaoItem}>
            <Text style={styles.reuniaoTitle}>{item.motivo}</Text>
            <Text style={styles.reuniaoDate}>{`Data: ${moment(item.data).format('DD/MM/YYYY')}`}</Text>
            <Text style={styles.reuniaoMotivo}>{`Motivo: ${item.motivo}`}</Text>
          </View>
        )}
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
  calendarWrapper: {
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  reuniaoItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'green',
  },
  reuniaoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reuniaoDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  reuniaoMotivo: {
    fontSize: 14,
    color: '#666',
  },
});
