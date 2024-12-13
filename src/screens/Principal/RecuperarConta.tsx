import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Linking, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// Interface para tipagem do estado do usuário
interface StatusDoUsuario {
  id: string;
  nome: string;
  email: string;
  endereco: string;
  cpf: string;
  matricula: string;
}

const Perfil = ({ navigation }: any) => {
  const [imagem, setImagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Carregando...');
  const [statusDoUsuario, setStatusDoUsuario] = useState<StatusDoUsuario | null>(null);

  // Função para verificar e solicitar permissões da galeria
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'A permissão para acessar a galeria é necessária!');
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao solicitar permissões.');
      return false;
    }
  };

  // Função para abrir a galeria e escolher a imagem
  const handleImageUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Photo,
        quality: 1,
      });

      if (result.canceled) {
        console.log('Seleção de imagem cancelada.');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setLoading(true);
        setLoadingText('Carregando imagem...');
        setImagem(selectedImage);
        await AsyncStorage.setItem('profileImage', selectedImage);
        setLoading(false);
        setLoadingText('Imagem carregada com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar a imagem.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dadosUsuario = await AsyncStorage.getItem('dadosUsuario');
        const usuario = JSON.parse(dadosUsuario || '{}');
        setStatusDoUsuario(usuario.userInfo || null);

        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setImagem(savedImage);
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados do usuário.');
      }
    };

    fetchData();
  }, []);

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

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      )}

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
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
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
