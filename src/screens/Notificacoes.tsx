import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  Modal,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app"; // Aqui você importa o axios ou qualquer instância de API configurada

interface Anexo {
  id: string;
  titulo: string;
  arquivo: string;
  tipo: string;
}

interface NotificaUser {
  id: string;
  titulo: string;
  descricao: string;
  idnotificacao: string;
}

const Notificacao = () => {
  const [notificacoes, setNotificacoes] = useState<NotificaUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcesso, setTokenAcesso] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalhesNotificacao, setDetalhesNotificacao] = useState<NotificaUser | null>(null);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];

  // Recupera o token do AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcesso(storedToken);
    };
    getToken();
  }, []);

  // Fetch de notificações após o token ser carregado
  useEffect(() => {
    if (tokenAcesso) {
      fetchNotificacoes(tokenAcesso);
    }
  }, [tokenAcesso]);

  const fetchNotificacoes = async (token: string) => {
    setIsLoading(true);
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`; // Define o token no cabeçalho da requisição
      const response = await api.get("/notificacao");
      setNotificacoes(response.data || []);
      console.log(response.data); // Exibe as notificações no console para visualização
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnexos = async (idNotificacao: string) => {
    console.log("🚀 ~ fetchAnexos ~ idNotificacao:", idNotificacao);
    setIsLoading(true);
    try {
      const response = await api.get(`documento/anexos-notificacao/${idNotificacao}`);
      setAnexos(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      Alert.alert("Não foi possível carregar os anexos.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (notificacao: NotificaUser) => {
    setDetalhesNotificacao(notificacao);
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    await fetchAnexos(notificacao.id);
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setDetalhesNotificacao(null);
      setAnexos([]);
    });
  };

  const renderNotificacao = ({ item }: { item: NotificaUser }) => (
    <TouchableOpacity style={styles.notificacaoItem} onPress={() => openModal(item)}>
      <Text style={styles.notificacaoTitulo}>{item.titulo}</Text>
      <Text style={styles.notificacaoDescricao}>{item.descricao}</Text>
    </TouchableOpacity>
  );

  const downloadFile = (url: string) => {
    Alert.alert("Download", `Baixando: ${url}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notificações..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <FlatList
          data={notificacoes.filter((notificacao) =>
            notificacao.titulo.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.idnotificacao} // Usando idnotificacao como chave
          renderItem={renderNotificacao}
          ListEmptyComponent={<Text style={styles.noNotificacoes}>Nenhuma notificação encontrada</Text>}
        />
      )}

      {modalVisible && (
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
              {detalhesNotificacao && (
                <>
                  <Text style={styles.modalTitulo}>{detalhesNotificacao.titulo}</Text>
                  <Text style={styles.modalDescricao}>{detalhesNotificacao.descricao}</Text>

                  {anexos.length > 0 && (
                    <>
                      <Text style={styles.modalAnexosTitulo}>Anexos para download:</Text>
                      <FlatList
                        data={anexos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <View style={styles.anexoItem}>
                            <Text style={styles.anexoTitulo}>{item.titulo}</Text>
                            <Button title="Baixar" onPress={() => downloadFile(item.arquivo)} />
                          </View>
                        )}
                      />
                    </>
                  )}

                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
  searchInput: {
    height: 40,
    borderColor: "#6200EE",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  notificacaoItem: {
    backgroundColor: "#DFFFD6",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  notificacaoTitulo: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#0D47A1" 
  },
  notificacaoDescricao: { 
    fontSize: 14, 
    color: "#424242" 
  },
  noNotificacoes: { 
    textAlign: "center", 
    marginTop: 20, 
    fontSize: 16, 
    color: "#BDBDBD" 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
  },
  modalTitulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#359830", 
    marginBottom: 10 
  },
  modalDescricao: { 
    fontSize: 16, 
    color: "#616161", 
    marginBottom: 10 
  },
  modalAnexosTitulo: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 10, 
    color: "#6200EE" 
  },
  anexoItem: { 
    padding: 10, 
    backgroundColor: "#EFEFEF", 
    borderRadius: 6, 
    marginVertical: 5 
  },
  anexoTitulo: { 
    fontWeight: "bold", 
    color: "#333" 
  },
  closeButton: { 
    marginTop: 20, 
    backgroundColor: "#359830", 
    padding: 10, 
    borderRadius: 8 
  },
  closeButtonText: { 
    color: "#FFF", 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  loader: { 
    flex: 1, 
    justifyContent: "center" 
  },
});

export default Notificacao;

