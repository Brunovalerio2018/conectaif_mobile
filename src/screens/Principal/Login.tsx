import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../app';

const LoginHome = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvarUsuario, setSalvarUsuario] = useState(false);
  const [logoAnim, setLogoAnim] = useState(new Animated.Value(-100));  // Inicia a logo fora da tela
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Anima logo de cima para baixo ao carregar ou ao fazer logout
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start();

    const checkLogin = async () => {
      const tokenData = await AsyncStorage.getItem('userToken');
      if (tokenData) {
        // Se já houver um token, redireciona para a tela principal
        navigation.navigate("TabRoutes");
      }

      // Busca o nome de usuário salvo e a senha
      const usuarioSalvo = await AsyncStorage.getItem('savedUsername');
      const senhaSalva = await AsyncStorage.getItem('savedPassword');
      if (usuarioSalvo && senhaSalva) {
        setUsuario(usuarioSalvo);
        setSenha(senhaSalva);
        setSalvarUsuario(true); // Marca o checkbox se houver dados salvos
      }
    };
    checkLogin();
  }, [navigation]);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const toggleSalvarUsuario = () => {
    setSalvarUsuario(!salvarUsuario);
  };

  const handlePress = async () => {
    if (!senha) {
      console.log("Digite sua senha");
      Alert.alert("Erro de Login", "Digite sua senha");
      return;
    }

    try {
      const retorno = await api.post('autorizacao/login', { login: usuario, senha: senha });
      const token = retorno?.data?.access_token;

      if (token) {
        await AsyncStorage.setItem('userToken', token);

        if (salvarUsuario) {
          // Salva o nome de usuário e a senha no AsyncStorage
          await AsyncStorage.setItem('savedUsername', usuario);
          await AsyncStorage.setItem('savedPassword', senha);
        } else {
          // Remove o nome de usuário e senha do AsyncStorage
          await AsyncStorage.removeItem('savedUsername');
          await AsyncStorage.removeItem('savedPassword');
        }

        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        console.log("Carregando seu perfil");
        Alert.alert("Login bem-sucedido!", "Bem-vindo ao sistema.");
        navigation.navigate("TabRoutes");
      } else {
        console.log("Sua senha está errada");
        Alert.alert("Erro de Login", "Sua senha está errada");
      }
    } catch (error) {
      console.error("Erro ao realizar login: ", error);
      Alert.alert("Erro de Login", "Houve um problema ao tentar fazer login. Tente novamente.");
    }
  };

  const handleRecuperarSenha = () => {
    navigation.navigate('RecuperarConta');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoAnim }] }]} >
        <Image
          source={require('../../../assets/logoConectaIF.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

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
          <Text style={styles.optionText}>
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

      {/* Checkbox para salvar o nome de usuário e a senha */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleSalvarUsuario}>
          <Text style={styles.checkboxLabel}>
            {salvarUsuario ? '☑' : '☐'} Salvar nome de usuário e senha
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: opacityAnim }}>
        <TouchableOpacity
          style={[styles.neonButton, { transform: [{ scale: 1.1 }] }]} // Efeito de escala no toque
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.watermark}>SISTEMA UNIFICADO CONECTAIF</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 1000,
    height: 550,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
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
    width: '100%',
    maxWidth: 290,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  spaceBetweenOptions: {
    height: 25,
  },
  optionText: {
    color: '#0066cc',
    marginBottom: -10,
  },
  checkboxContainer: {
    marginVertical: 30,
  },
  checkboxLabel: {
    color: '#333',
    fontSize: 16,
  },
  neonButton: {
    backgroundColor: '#359830',  // A cor #359830 foi mantida
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    marginVertical: 0,
    borderWidth: 0,
    borderColor: '#359830',  // A cor #359830 foi mantida
    alignItems: 'center',
    transform: [{ scale: 1 }],
    transition: '0.3s',  // Transição para efeitos suaves
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase', // Deixa o texto em maiúsculas
    letterSpacing: 2, // Espaçamento nas letras
  },
  watermark: {
    position: 'absolute',
    top: 30,
    right: 10,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.2)',
  },
});

export default LoginHome;
