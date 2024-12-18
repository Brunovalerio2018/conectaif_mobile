import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecuperarConta = () => {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [identifierType, setIdentifierType] = useState('email');
  const logoAnim = new Animated.Value(0);
  const navigation = useNavigation(); // Para navegação

  const handleRecuperarConta = () => {
    if (!email.trim()) {
      Alert.alert('Por favor, coloque seu email.');
      return;
    }
    console.log(`Identificador enviado: ${email} (${identifierType})`);
    setModalVisible(false);
  };

  const startLogoAnimation = () => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoAnim }] }]}>
        <Image
          source={require('../../../assets/logoConectaIF.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Container com os botões Voltar e Recuperar Conta */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setModalVisible(true); startLogoAnimation(); }}>
          <Text style={styles.recuperarContaText}>Recuperar conta...</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Conta</Text>

            <TextInput
              style={styles.input}
              placeholder={`Digite seu email ${identifierType === 'email'}`}
              value={email}
              onChangeText={setEmail}
              keyboardType={identifierType === 'email' ? 'email-address' : 'default'}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleRecuperarConta}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  backButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#359830',
    borderRadius: 18,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recuperarContaText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 550,
    height: 850,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 35,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: '#359830',
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: '#359830',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RecuperarConta;
