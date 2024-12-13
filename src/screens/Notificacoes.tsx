import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Button, Modal, Alert, ActivityIndicator, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app"; // Certifique-se de que o arquivo 'api.js' ou 'api.ts' está configurado corretamente.

interface Anexo {
  titulo: string;
  arquivo: string;
  tipo: string;
}

interface NotificaUser {
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

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcesso(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcesso) {
      fetchNotificacoes(tokenAcesso);
    }
  }, [tokenAcesso]);

  const fetchNotificacoes = async (token: string) => {
    setIsLoading(true);
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await api.get("/notificacao");
      setNotificacoes(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnexos = async (idNotificacao: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/documento/anexos-notificacao/${idNotificacao}`);
      setAnexos(response.data);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      Alert.alert("Erro", "Não foi possível carregar os anexos.");
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
    await fetchAnexos(notificacao.idnotificacao);

    // Enviar alerta de "visualizada"
    await api.patch(`/visualizada/${notificacao.idnotificacao}`);
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

  const downloadFile = async (url: string) => {
    Alert.alert("Download", `Baixando: ${url}`);

    // Enviar alerta de "download feito"
    await api.patch(`/visualizada/${url}`); // O ID do documento pode ser enviado aqui para indicar que o download foi realizado
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
          keyExtractor={(item) => item.idnotificacao}
          renderItem={renderNotificacao}
          ListEmptyComponent={
            <Text style={styles.noNotificacoes}>Nenhuma notificação encontrada</Text>
          }
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

                  <Text style={styles.modalAnexosTitulo}>Anexos:</Text>
                  {anexos.length > 0 ? (
                    <FlatList
                      data={anexos}
                      keyExtractor={(item) => item.titulo}
                      renderItem={({ item }) => (
                        <View style={styles.anexoItem}>
                          <Text style={styles.anexoTitulo}>{item.titulo}</Text>
                          <Text>Tipo: {item.tipo}</Text>
                          <Button title="Baixar" onPress={() => downloadFile(item.arquivo)} />
                        </View>
                      )}
                    />
                  ) : (
                    <Text style={styles.modalNoAnexos}>Nenhum anexo encontrado</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    height: 40,
    borderColor: "#6200EE",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  notificacaoItem: {
    backgroundColor: "#98FB98",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificacaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D47A1",
  },
  notificacaoDescricao: {
    fontSize: 14,
    color: "#616161",
  },
  noNotificacoes: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#BDBDBD",
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#359830",
  },
  modalDescricao: {
    fontSize: 16,
    marginBottom: 20,
    color: "#424242",
  },
  modalAnexosTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6200EE",
  },
  anexoItem: {
    padding: 10,
    backgroundColor: "#BBDEFB",
    marginVertical: 5,
    borderRadius: 6,
  },
  anexoTitulo: {
    fontWeight: "bold",
    color: "#FF0000",
  },
  modalNoAnexos: {
    textAlign: "center",
    color: "#FF0000",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#359830",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Notificacao;
