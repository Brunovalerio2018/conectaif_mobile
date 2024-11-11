import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Button, Linking, Image, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStatus {
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  matricula: string;
  dataNascimento: string;
  genero: string;
  curso: string;
  turma: string;
  responsavel: string;
  telefone: string;
}

const Perfil = ({ navigation }: any) => {
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Adicionando estado de carregamento

  const token = 'userToken';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGoogleClassroom = () => {
    Linking.openURL('https://classroom.google.com/');
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('http://usuarios/UsuariosController_findById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: '' }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Informações do usuário:', data);
        setUserStatus({
          nome: data.nome || '',
          email: data.email || '',
          endereco: data.endereco || '',
          cpf: data.cpf || '',
          matricula: data.matricula || '',
          dataNascimento: data.dataNascimento || '',
          genero: data.genero || '',
          curso: data.curso || '',
          turma: data.turma || '',
          responsavel: data.responsavel || '',
          telefone: data.telefone || '',
        });
      } else {
        console.log('Erro ao buscar informações do usuário:', data.message);
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      Alert.alert('Erro', 'Falha ao buscar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false); // Quando os dados forem carregados ou falharem
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    }
  }, [token]); // Chama a função de buscar dados ao montar o componente

  const handleLogout = async () => {
    try {
      // Remove o token do AsyncStorage
      await AsyncStorage.removeItem('userToken');
      // Navega de volta para a tela de login
      navigation.replace('Login'); // Aqui você substitui pela sua navegação para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao sair. Tente novamente mais tarde.');
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#4CAF50',
    decimalPlaces: 4,
    color: (opacity = 2) => `rgba(55, 152, 8, ${opacity})`,
    labelColor: (opacity = 4) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 106,
    },
    propsForDots: {
      r: '20',
      strokeWidth: '10',
      stroke: '#ffa726',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>Importar Foto</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{userStatus?.nome || 'Nome Não Disponível'}</Text>
      </View>

      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Email:</Text>
        <Text style={styles.itemText}>{userStatus?.email || 'Não disponível'}</Text>
      </View>

      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Matrícula:</Text>
        <Text style={styles.itemText}>{userStatus?.matricula || 'Não disponível'}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Telefone:</Text>
          <Text style={styles.itemText}>{userStatus?.telefone}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Endereço:</Text>
          <Text style={styles.itemText}>{userStatus?.endereco}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Nascimento:</Text>
          <Text style={styles.itemText}>{userStatus?.dataNascimento}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Gênero:</Text>
          <Text style={styles.itemText}>{userStatus?.genero}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Campos Acadêmicos</Text>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Curso:</Text>
          <Text style={styles.itemText}>{userStatus?.curso}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Turma:</Text>
          <Text style={styles.itemText}>{userStatus?.turma}</Text>
        </View>
      </View>

      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={openGoogleClassroom}>
        <Text style={styles.buttonText}>Abrir Google Sala de Aula</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 90,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    color: '#777',
    fontSize: 14,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  chartContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 20
  },
  calendarContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  calendar: {
    width: '100%',
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  calendarDay: {
    fontSize: 16,
    color: '#333',
  },
  calendarWeekend: {
    fontSize: 16,
    color: '#e53935',
  },
  calendarEvent: {
    fontSize: 16,
    color: '#4CAF50',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 0,
  },
});

export default Perfil;