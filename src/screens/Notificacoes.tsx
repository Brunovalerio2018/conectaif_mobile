import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from "react-native";
import api from "../app";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  createdAt: string;
  tpdestinatario: string;
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para controle de carregamento
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false); // Estado para controle do timeout

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcess) {
      fetchNotificacoes(tokenAcess);
    }
  }, [tokenAcess]);

  // Função para buscar notificações
  const fetchNotificacoes = async (tokenAcess: string) => {
    setLoading(true); // Começa o carregamento
    setTimeoutReached(false); // Resetando o timeout

    const timer = setTimeout(() => {
      setLoading(false);
      setTimeoutReached(true); // Se passar de 10 segundos, exibe a mensagem de "Nenhum documento encontrado!"
    }, 10000); // 10 segundos

    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/notificacao");

      if (response.status === 200) {
        setNotificacoes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      clearTimeout(timer); // Limpa o timer caso a busca termine antes de 10 segundos
      setLoading(false); // Para o carregamento
    }
  };

  const renderNotificacao = ({ item }: { item: Notificacao }) => (
    <View style={styles.notificacaoItem}>
      <Text style={styles.notificacaoTitle}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Data: ${new Date(item.createdAt).toLocaleDateString("pt-BR")}`}</Text>
      <Text>{`Destinatário: ${item.tpdestinatario}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notificações..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <Text style={styles.loadingText}>Buscando Documentos...</Text>
      ) : timeoutReached ? (
        <Text style={styles.noNotificacoes}>Nenhum documento encontrado!</Text>
      ) : (
        <FlatList
          data={notificacoes.filter((notificacao) =>
            notificacao.titulo.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificacao}
          ListEmptyComponent={<Text style={styles.noNotificacoes}>Nenhuma notificação encontrada</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#359830",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  notificacaoItem: {
    backgroundColor: "#90EE90",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  notificacaoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noNotificacoes: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 14,
    color: "#999",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#359830",
  },
});
