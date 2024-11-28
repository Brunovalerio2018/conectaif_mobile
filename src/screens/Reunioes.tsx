import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';
import moment from 'moment';
import 'moment/locale/pt-br';

export default function Reunioes() {
  const [reunioes, setReunioes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setTokenAcess(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcess) {
      console.log('Token encontrado:', tokenAcess);
      fetchReunioes(tokenAcess);
    }
  }, [tokenAcess]);

  const fetchReunioes = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get(`/reuniao`);
      const data = response.data;

      if (data) {
        setReunioes(data);
        const newMarkedDates: any = {};
        data.forEach((reuniao: any) => {
          newMarkedDates[reuniao.data] = {
            marked: true,
            selected: false,
            dotColor: 'red',
            selectedColor: 'green',
          };
        });
        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.log('Erro ao buscar reuniões:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filterByDate = (date: string) => {
    setSelectedDate(date);
    return reunioes.filter((reuniao: any) => reuniao.data === date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <CalendarPicker
          onDateChange={(date: any) => {
            const selectedDate = moment(date).format('YYYY-MM-DD');
            console.log('Data selecionada:', selectedDate);
            filterByDate(selectedDate);
          }}
          selectedDate={selectedDate ? moment(selectedDate) : null}
          weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
          months={[
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ]}
          todayTextStyle={{ color: '#7CFC00' }}
          selectedDayColor="green"
          selectedDayTextColor="white"
          todayBackgroundColor="green"
          customDatesStyles={Object.keys(markedDates).map((date) => ({
            date: moment(date, 'YYYY-MM-DD').toDate(),
            style: { backgroundColor: 'red' },
            textStyle: { color: 'white' },
          }))}
          previousTitle="Anterior"  // Texto personalizado para o botão de "Anterior"
          nextTitle="Próximo"       // Texto personalizado para o botão de "Próximo"
        />
      </View>

      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar reunião..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Lista de reuniões */}
      <FlatList
        data={reunioes.filter(
          (reuniao: any) =>
            reuniao.titulo.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedDate ? reuniao.data === selectedDate : true)
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.reuniaoItem}>
            <Text style={styles.reuniaoTitle}>{item.titulo}</Text>
            <Text>{item.descricao}</Text>
            <Text>{`Data: ${item.data}`}</Text>
            <Text>{`Status: ${item.status}`}</Text>
            <Button title="Ver Detalhes" onPress={() => {}} />
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
    elevation: 5, // Para Android
    shadowColor: '#359830',
    shadowOffset: { width: 10, height: 20 },
    shadowOpacity: 30.20,
    shadowRadius: 22,
    borderRadius: 15.10, // Arredondando os cantos para maior realismo
    backgroundColor: 'white',
    borderColor: '#359830'
  },
  searchInput: {
    height: 40,
    borderColor: '#359830',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10 ,
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
