import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importação para ícones de visibilidade
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../app';

const LoginHome = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvarUsuario, setSalvarUsuario] = useState(false);
  const [logoAnim, setLogoAnim] = useState(new Animated.Value(-100));
  const navigation = useNavigation();

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start();

    const checkLogin = async () => {
      const tokenData = await AsyncStorage.getItem('userToken');
      if (tokenData) {
        navigation.navigate("TabRoutes");
      }

      const usuarioSalvo = await AsyncStorage.getItem('savedUsername');
      const senhaSalva = await AsyncStorage.getItem('savedPassword');
      if (usuarioSalvo && senhaSalva) {
        setUsuario(usuarioSalvo);
        setSenha(senhaSalva);
        setSalvarUsuario(true);
      }
    };
    checkLogin();
  }, [navigation]);

  const handlePress = async () => {
    if (!senha) {
      Alert.alert("Erro de Login", "Digite sua senha");
      return;
    }

    try {
      const retorno = await api.post('autorizacao/login', { login: usuario, senha: senha });
      const token = retorno?.data?.access_token;
      console.log(retorno?.data)

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        if (salvarUsuario) {
          await AsyncStorage.setItem('savedUsername', usuario);
          await AsyncStorage.setItem('savedPassword', senha);
        } else {
          await AsyncStorage.removeItem('savedUsername');
          await AsyncStorage.removeItem('savedPassword');
        }

        navigation.navigate("TabRoutes");
      } else {
        Alert.alert("Erro de Login", "Sua senha está errada");
      }
    } catch (error) {
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
        placeholder="    Digite seu usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <Text style={styles.label2}>Senha:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="   Digite sua senha"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={toggleMostrarSenha} style={styles.eyeIcon}>
          <Icon 
            name={mostrarSenha ? 'visibility' : 'visibility-off'} 
            size={24} 
            color="#359830"
          />
        </TouchableOpacity>
      </View>

      {/* Adicionado o botão para recuperação de senha */}
      <TouchableOpacity onPress={handleRecuperarSenha}>
        <Text style={styles.optionText}>
          Esqueceu ou deseja alterar sua senha?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.neonButton]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>

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
    marginBottom: -30,
  },
  logo: {
    width: 1000,
    height: 450,
    marginVertical: -40
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  label1: {
    fontSize: 18,
    marginBottom: 0,
    marginLeft: -220,
    color: '#333',
  },
  label2: {
    fontSize: 18,
    marginBottom: 0,
    borderTopLeftRadius: 20,
    marginLeft: -210,
  },
  input: {
    borderWidth: 2,
    borderColor: '#359830',
    padding: 4,
    paddingLeft: 12, // Adicionando espaço para o cursor
    marginBottom: 15,
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
    marginBottom: 10,
    textDecorationLine: 'underline',
    marginVertical: 20
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxLabel: {
    color: '#333',
    fontSize: 14,
  },
  neonButton: {
    backgroundColor: '#359830',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    marginVertical: -80,
    borderWidth: 0,
    borderColor: '#359830',
    alignItems: 'center',
    transform: [{ scale: 1 }],
  
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',

    letterSpacing: 5,
  },
  watermark: {
    position: 'absolute',
    top: 30,
    right: 10,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#359830',
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    paddingHorizontal: 10,
    marginBottom: 75,
    width: '100%',
    maxWidth: 290,
  },
  inputSenha: {
    flex: 1,
    paddingVertical: 5,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});

export default LoginHome;





