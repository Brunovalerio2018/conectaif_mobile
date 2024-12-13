import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox'; // Biblioteca para o checkbox

import api from '../../app';

const LoginHome = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvarUsuario, setSalvarUsuario] = useState(false);
  const [logoAnim, setLogoAnim] = useState(new Animated.Value(-100));
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [progress, setProgress] = useState(new Animated.Value(0)); // Estado da barra de progresso
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

    // Inicia o carregamento
    setLoading(true);

    // Anima a barra de progresso
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // 5 segundos
      useNativeDriver: false,
    }).start();

    try {
      // Simula o delay do carregamento
      setTimeout(async () => {
        const retorno = await api.post('autorizacao/login', { login: usuario, senha: senha });
        const { access_token, ...dadosUsuario } = retorno?.data;

        if (access_token) {
          await AsyncStorage.setItem('userToken', access_token);
          await AsyncStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
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

        // Após 5 segundos, termina o carregamento
        setLoading(false);
      }, 5000);
    } catch (error) {
      setLoading(false);
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

      {/* Checkbox para salvar as credenciais */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={salvarUsuario}
          onValueChange={setSalvarUsuario}
          color={salvarUsuario ? '#359830' : undefined}
        />
        <Text style={styles.checkboxLabel}>Salvar usuário e senha</Text>
      </View>

      {/* Adicionado o botão para recuperação de senha */}
      <TouchableOpacity onPress={handleRecuperarSenha}>
        <Text style={styles.optionText}>
          Esqueceu ou deseja alterar sua senha?
        </Text>
      </TouchableOpacity>

      {/* Barra de progresso de carregamento */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
      )}

      {/* Botão de login com spinner de carregamento */}
      <TouchableOpacity
        style={[styles.neonButton]}
        onPress={handlePress}
        disabled={loading} // Desabilita o botão durante o carregamento
      >
        {loading ? (
          <Text style={styles.buttonText}>Carregando...</Text>
        ) : (
          <Text style={styles.buttonText}>Acessar</Text>
        )}
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
    width: 600,
    height: 550,
    marginVertical: -90,
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
    paddingLeft: 12,
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
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 55,
    marginTop: -39,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  neonButton: {
    backgroundColor: '#359830',
    paddingVertical: 1,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowRadius: 1,
    elevation: 5,
    justifyContent: 'center',
    marginVertical: -80,
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
    top: 65,
    right: 20,
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
  loadingContainer: {
    width: '80%',
    height: 0,
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    marginVertical: 0,
    
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#359830',
    borderRadius: 10,
  },
});

export default LoginHome;
