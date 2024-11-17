import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';
import { Avatar } from 'react-native-paper';

interface StatusDoUsuario {
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  matricula: string;
  notas: string[];
  faltas: string[];
  progressoAcademico: string;
  curso: string;
  professor: string;
}

const Perfil = ({ navigation }: any) => {
  const [statusDoUsuario, setStatusDoUsuario] = useState<StatusDoUsuario | null>(null);
  const [imagem, setImagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenAcesso, setTokenAcesso] = useState('');

  const token = AsyncStorage.getItem('userToken').then(res => setTokenAcesso(res ?? '-'));


  const buscarInformacoesDoUsuario = async (tokenAcesso: string, idUsuario: number) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcesso}`;
      const resposta = await api.post('usuarios/busca-um', { id: idUsuario });
      const dados = await resposta.data;
      if (dados.id) {
        setStatusDoUsuario({
          nome: dados.nome || '',
          email: dados.email || '',
          endereco: dados.endereco || '',
          cpf: dados.cpf || '',
          matricula: dados.matricula || '',
          notas: dados.notas || [],
          faltas: dados.faltas || [],
          progressoAcademico: dados.progressoAcademico || '',
          curso: dados.curso || '',
          professor: dados.professor || '',
        });
      } else {
        Alert.alert('Erro', 'Erro ao buscar informações do usuário.');
      }
    } catch (erro) {
      console.error('Erro ao buscar informações do usuário:', erro);
      Alert.alert('Erro', 'Falha ao buscar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    } catch (erro) {
      console.error('Erro ao fazer logout:', erro);
      Alert.alert('Erro', 'Falha ao sair. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    if (tokenAcesso) {
      buscarInformacoesDoUsuario(tokenAcesso, 5); // Exemplo com ID 5
    }
  }, [tokenAcesso]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecalhoPerfil}>
        <Text style={styles.nomePerfil}>{statusDoUsuario?.nome || 'Nome Não Disponível'}</Text>
        <Text style={styles.detalhesPerfil}>Matrícula: {statusDoUsuario?.matricula || 'Não disponível'}</Text>
        <Text style={styles.detalhesPerfil}>Curso: {statusDoUsuario?.curso || 'Não disponível'}</Text>
      </View>

      <View style={styles.secaoContainer}>
        <Text style={styles.tituloSecao}>Dados Pessoais</Text>
        <View style={styles.itemLista}>
          <Text style={styles.tituloItem}>Email:</Text>
          <Text style={styles.textoItem}>{statusDoUsuario?.email || 'Não disponível'}</Text>
        </View>
        <View style={styles.itemLista}>
          <Text style={styles.tituloItem}>Endereço:</Text>
          <Text style={styles.textoItem}>{statusDoUsuario?.endereco || 'Não disponível'}</Text>
        </View>
      </View>

      <View style={styles.secaoContainer}>
        <Text style={styles.tituloSecao}>Acompanhamento Acadêmico</Text>
        <View style={styles.itemLista}>
          <Text style={styles.tituloItem}>Progresso Acadêmico:</Text>
          <Text style={styles.textoItem}>{statusDoUsuario?.progressoAcademico || 'Não disponível'}</Text>
        </View>
      </View>

      <View style={styles.secaoContainer}>
        <Text style={styles.tituloSecao}>Informações de Comunicação</Text>
        <TouchableOpacity style={styles.botao} onPress={() => Linking.openURL('https://classroom.google.com/')}>
          <Text style={styles.textoBotao}>Abrir Google Sala de Aula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => Linking.openURL('https://docs.google.com/forms')}>
          <Text style={styles.textoBotao}>Abrir Formulário Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secaoContainer}>
        <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
          <Text style={styles.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  cabecalhoPerfil: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  nomePerfil: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detalhesPerfil: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  secaoContainer: {
    marginBottom: 20,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tituloItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  textoItem: {
    fontSize: 16,
    color: '#555',
  },
  botao: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoLogout: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Perfil;
