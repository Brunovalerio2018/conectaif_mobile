// RecuperarConta.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação


const RecuperarConta = () => {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
  const [matriculaCpf, setMatriculaCpf] = useState('');
  const navigation = useNavigation();

  const handleAvancar = () => {
    console.log('Opção selecionada:', opcaoSelecionada);

    console.log('Matrícula ou CPF:', matriculaCpf);
  };

  const handleVoltar = () => {
    navigation.goBack('LoginHome'); 
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

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, opcaoSelecionada === 'senha' && styles.selectedOption]}
          onPress={() => setOpcaoSelecionada('senha')}
        >
        
          <Text style={styles.optionText}>Perdi email academico</Text>
        </TouchableOpacity>
      </View>

      {opcaoSelecionada && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Digite sua matrícula ou CPF:</Text>
          <TextInput
            style={styles.input}
            placeholder="Matrícula ou CPF"
            value={matriculaCpf}
            onChangeText={setMatriculaCpf}
          />
          
          <TouchableOpacity 
            style={styles.neonButton} 
            onPress={handleAvancar} 
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Avançar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.voltarButton} 
        onPress={handleVoltar} 
        activeOpacity={0.8}
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -10, // Aumenta a aproximação do título em relação ao logo
  },
  logo: {
    width: 1000, 
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
    borderRadius: 10,
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
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
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
    borderRadius: 10,
    backgroundColor: '#eaeaea',
    width: '80%',
  },
  neonButton: {
    backgroundColor: '#359830',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50, // Alterado de 5 para 10
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 20,
    elevation: 0,
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 0,
    borderColor: '#00ff00',
  },

  buttonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  
  },
  voltarButton: {
    backgroundColor: '#359830',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 0,
  },
  voltarButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecuperarConta;
