import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';
import { launchImageLibrary } from 'react-native-image-picker';

interface StatusDoUsuario {
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  matricula: string;
}

const Perfil = ({ navigation }: any) => {

            const [statusDoUsuario, setStatusDoUsuario] = useState<StatusDoUsuario | null>(null);
            const [imagem, setImagem] = useState<string | null>(null);
            const [loading, setLoading] = useState(false);
            const [tokenAcesso, setTokenAcesso] = useState('');

            useEffect(() => {
              const fetchToken = async () => {
                const token = await AsyncStorage.getItem('userToken');
                setTokenAcesso(token || '');
              };
              fetchToken();
            }, []);

  const buscarInformacoesDoUsuario = async (tokenAcesso: string, idUsuario: number) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcesso}`;
      const resposta = await api.post('usuarios/busca-um', { id: idUsuario });
      const dados = resposta.data;

      if (dados.id) {
        setStatusDoUsuario({
          nome: dados.nome || '',
          email: dados.email || '',
          endereco: dados.endereco || '',
          cpf: dados.cpf || '',
          matricula: dados.matricula || '',
        });
        setImagem(dados.imagemUrl || '');
      } else {
        Alert.alert('Erro', 'Erro ao buscar informações do usuário.');
      }
    } catch (erro) {
      console.error('Erro ao buscar informações do usuário:', erro);
      Alert.alert('Erro', 'Falha ao buscar os dados. Tente novamente mais tarde.');
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

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel) {
        console.log('Seleção de imagem cancelada.');
        return;
      }
      if (response.errorMessage) {import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app';
import { launchImageLibrary } from 'react-native-image-picker';

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

        Alert.alert('Erro', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const selectedImage = response.assets[0];
        try {
          setLoading(true);

          const imageResponse = await fetch(selectedImage.uri || '');
          const blob = await imageResponse.blob();

          // Enviar diretamente sem usar FormData
          api.defaults.headers.common.Authorization = `Bearer ${tokenAcesso}`;
          const uploadResponse = await api.post('usuarios/upload-imagem', {
            imagem: blob,
            fileName: selectedImage.fileName,
            mimeType: selectedImage.type,
          }, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (uploadResponse.data.success) {
            setImagem(uploadResponse.data.imagemUrl);
            Alert.alert('Sucesso', 'Imagem de perfil atualizada!');
          } else {
            Alert.alert('Erro', 'Falha ao atualizar a imagem.');
          }
        } catch (erro) {
          console.error('Erro ao fazer upload da imagem:', erro);
          Alert.alert('Erro', 'Falha ao fazer upload da imagem.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    if (tokenAcesso) {
      buscarInformacoesDoUsuario(tokenAcesso, 1);
    }
  }, [tokenAcesso]);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecalhoPerfil}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={{ uri: imagem || 'https://via.placeholder.com/100' }}
            style={styles.imagemPerfil}
          />
        </TouchableOpacity>
        <Text style={styles.nomePerfil}>{statusDoUsuario?.nome || 'Nome Indisponível'}</Text>
        <Text style={styles.detalhesPerfil}>Matrícula: {statusDoUsuario?.matricula || 'Não disponível'}</Text>
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

      <View style={styles.botaoContainer}>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => Linking.openURL('https://classroom.google.com')}>
          <Text style={styles.textoBotao}>Sala de Aula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => Linking.openURL('https://forms.google.com')}>
          <Text style={styles.textoBotao}>Google Forms</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  cabecalhoPerfil: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nomePerfil: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detalhesPerfil: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  secaoContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  tituloItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  textoItem: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: '#359830',
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Perfil;
