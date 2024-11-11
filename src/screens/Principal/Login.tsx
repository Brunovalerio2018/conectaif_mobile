import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../app';

const LoginHome = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation(); 


  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handlePress = async () => {
    console.log('antes do post');
    try {
        const retorno = await api.post('autorizacao/login', { login: usuario, senha: senha });
        console.log(retorno);
        const token = retorno?.data?.access_token;

        if (token) {

            await AsyncStorage.setItem('userToken', token);

            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            Alert.alert("Login bem-sucedido!", "Bem-vindo ao sistema.");
            navigation.navigate("TabRoutes");
        } else {
            Alert.alert("Erro de Login", "Usuário ou senha incorretos.");
        }
    } catch (error) {
        console.error("Erro ao realizar login: ", error);
        Alert.alert("Erro de Login", "Houve um problema ao tentar fazer login. Tente novamente.");
    }
};

const fetchData = async () => {
  try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await api.get('sua-api/protegida', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      // Processar a resposta
    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
  }
};

  const handleRecuperarSenha = () => {
    navigation.navigate('RecuperarConta'); 
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

      <Text style={styles.title}>Login ConectaIF</Text>

      <Text style={styles.label1}>Usuário:</Text>
      <TextInput
        style={styles.input}
        placeholder="  Nome de usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <Text style={styles.label2}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="   Digite sua senha"
        secureTextEntry={!mostrarSenha}
        value={senha}
        onChangeText={setSenha}
      />

      <View style={styles.optionsContainer}>
         <TouchableOpacity onPress={toggleMostrarSenha}>
                    <Text    style={styles.optionText}>
                                   {mostrarSenha ? 'Ocultar a senha' : 'Exibir a senha'}
                   </Text>
        </TouchableOpacity>

        <View style={styles.spaceBetweenOptions} />

        <TouchableOpacity onPress={handleRecuperarSenha}>
          <Text style={styles.optionText}>
            Esqueceu ou deseja alterar sua senha?
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: opacityAnim }}>
        <TouchableOpacity
          style={styles.neonButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Adiciona a marca d'água */}
      <Text style={styles.watermark}>SISTEMA UNIFICADO CONECTAIF</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -10, // Aumenta a aproximação do título em relação ao logo
  },
  logo: {
    width: 1000, // Ajuste a largura da logo para melhor proporção
    height: 550, // Ajuste a altura da logo para melhor proporção
  },
  title: {
    fontSize: 25,
    marginBottom: 10, // Diminuí a margem inferior para aproximar o título do logo
    textAlign: 'center',
    color: '#000',
  },
  label1: {
    fontSize: 20,
    marginBottom: 0,
    marginLeft: -220,
    color: '#333',
  },
  label2: {
    fontSize: 20,
    marginBottom: 0,
    borderTopLeftRadius: 20,
    marginLeft: -210,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 3,
    marginBottom: 13,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    width: '100%', // Faz com que o campo de entrada ocupe toda a largura disponível
    maxWidth: 290, // Limita a largura máxima para manter a proporção
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  spaceBetweenOptions: {
    height: 25, // Altura do espaço entre as opções
  },
  optionText: {
    color: '#0066cc',
    marginBottom: -10,
  },
  neonButton: {
    backgroundColor: '#359830',
    paddingVertical: 9,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0.10, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    marginVertical: 60,
    borderWidth: 0,
    borderColor: '#00ff00',
  },
  buttonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: 30, // Posiciona a marca d'água no topo da tela
    right: 10, // Posiciona a marca d'água à direita
    fontSize: 12, // Tamanho da fonte da marca d'água
    color: 'rgba(0, 0, 0, 0.2)', // Cor cinza claro com opacidade
  },
});

export default LoginHome;