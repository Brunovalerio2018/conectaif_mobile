import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Alert } from "react-native";
import api from "../app";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
}

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcesso, setTokenAcesso] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        setTokenAcesso(storedToken);
      } catch (error) {
        console.error("Erro ao buscar o token:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcesso) {
      fetchOcorrencias(tokenAcesso);
    }
  }, [tokenAcesso]);

  const fetchOcorrencias = async (token: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await api.get("/ocorrencia");
      const data = response.data;

      console.log(data);
      if (response.status === 200) {
        setOcorrencias(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar as ocorrências.");
      }
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      Alert.alert("Erro", "Ocorreu um problema ao buscar as ocorrências.");
    }
  };

  const renderOcorrencia = ({ item }: { item: Ocorrencia }) => (
    <View style={styles.ocorrenciaItem}>
      <Text style={styles.ocorrenciaTitle}>{item.titulo}</Text>
      <Text style={styles.ocorrenciaDescription}>{item.descricao}</Text>
      <Text style={styles.ocorrenciaDate}>{item.data}</Text>
      <Text style={styles.ocorrenciaStatus}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ocorrências..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={ocorrencias.filter(
          (ocorrencia) =>
            ocorrencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ocorrencia.descricao.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderOcorrencia}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noOcorrencias}>Nenhuma ocorrência encontrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  searchInput: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#359830',
    borderWidth: 2, // Adicionando borda para destacar
  },
  ocorrenciaItem: {
    backgroundColor: "#DFFFD6",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  ocorrenciaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#359830", // Usando a cor solicitada para o título
    marginBottom: 8,
  },
  ocorrenciaDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ocorrenciaDate: {
    fontSize: 12,
    color: "#999",
  },
  ocorrenciaStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#359830", // Usando a cor solicitada para o status
    marginTop: 8,
  },
  noOcorrencias: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});
