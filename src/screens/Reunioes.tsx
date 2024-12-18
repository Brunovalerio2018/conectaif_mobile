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
            <Text style={styles.reuniaoMotivo}>{item.motivo}</Text>
            <Text style={styles.reuniaoData}>{moment(item.data).format('DD/MM/YYYY')}</Text>

          </View>
        )}
        ListEmptyComponent={<Text style={styles.noReunioes}>Nenhuma reunião encontrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  calendarWrapper: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    borderColor: '#359830',
    borderWidth: 1,
  },
  reuniaoItem: {
    backgroundColor: '#DFFFD6',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  reuniaoMotivo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#359830',
  },
  reuniaoData: {
    fontSize: 16,
    color: '#666',
  },
  noReunioes: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
