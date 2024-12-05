import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Button } from 'react-native';
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

  // Função para buscar as reuniões na API
  const fetchReunioes = async (tokenAcess: string) => {
    try {
      // Configura o cabeçalho da requisição com o token de autenticação
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenAcess}`;
      const response = await api.get<ReuniaoInfo[]>('/reuniao');
    
      if (response.status === 200) {
        const data = response.data;
        setReunioes(data);

        // Marca as datas das reuniões no calendário
        const newMarkedDates: any = {};
        data.forEach((reuniao: ReuniaoInfo) => {
          newMarkedDates[moment(reuniao.data).format('YYYY-MM-DD')] = {
            marked: true,
            dotColor: 'red',
            selectedColor: 'green',
          };
        });
        setMarkedDates(newMarkedDates);
      } else {
        console.log('Erro ao buscar reuniões: ', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
    }
  };

  // Função para filtrar as reuniões pela data selecionada
  const filterByDate = (date: string) => {
    setSelectedDate(date);
    return reunioes.filter((reuniao) => moment(reuniao.data).isSame(date, 'day'));
  };

  return (
    <View style={styles.container}>
      {/* Calendário */}
      <View style={styles.calendarWrapper}>
        <CalendarPicker
          onDateChange={(date: any) => {
            const selectedDate = moment(date).format('YYYY-MM-DD');
            console.log('Data selecionada:', selectedDate);
            filterByDate(selectedDate);
          }}
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
            <Text>{`Data: ${moment(item.data).format('DD/MM/YYYY')}`}</Text>
            <Text>{`Servidor ID: ${item.idservidor}`}</Text>
            <Text>{`Notificação ID: ${item.idnotificacao}`}</Text>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reuniaoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
