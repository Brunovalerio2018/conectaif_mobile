import React, { useState } from 'react';
import {  View,
          Text,
          TextInput,
          StyleSheet,
          TouchableOpacity,
          Image,
          ActivityIndicator,
          Alert,
      } from 'react-native';
      import { useNavigation } from '@react-navigation/native';
      import api from '../../app';

const RecuperarConta = () => {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
  const [matriculaCpf, setMatriculaCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAvancar = async () => {
    if (!opcaoSelecionada || !matriculaCpf) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const resposta = await api.post('/recuperar-conta', {
        opcao: opcaoSelecionada,
        matriculaCpf,
      });

      if (resposta.data.success) {
        Alert.alert('Sucesso', 'As instruções para recuperação foram enviadas.');
        navigation.navigate('LoginHome');
      } else {
        Alert.alert('Erro', resposta.data.message || 'Erro ao processar a recuperação.');
      }
    } catch (erro) {
      console.error('Erro ao recuperar conta:', erro);
      Alert.alert('Erro', 'Falha ao processar o pedido. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logoConectaIF.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Recuperar Conta</Text>


  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Digite sua matrícula ou CPF:</Text>
          <TextInput
            style={styles.input}
            placeholder="Matrícula ou CPF"
            value={matriculaCpf}
            onChangeText={setMatriculaCpf}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.neonButton}
              onPress={handleAvancar}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Avançar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.voltarButton}
              onPress={handleVoltar}
              activeOpacity={0.8}
            >
              <Text style={styles.voltarButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -10,
  },
  logo: {
    width: 700,
    height: 550,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  optionsContainer: {
    marginBottom: 0,
    marginVertical: 0,
    alignItems: 'center',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    width: '80%',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#d4e6f1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    borderRadius: 40,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 50,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    width: '80%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '80%',
  },
  neonButton: {
    backgroundColor: '#359830',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voltarButton: {
    backgroundColor: '#359830',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  voltarButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecuperarConta;
