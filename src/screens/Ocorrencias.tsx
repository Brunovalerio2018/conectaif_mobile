import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
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
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);
  const [novaOcorrencia, setNovaOcorrencia] = useState({ tipo: "", titulo: "", descricao: "" });

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          setTokenAcess(storedToken);
        } else {
          Alert.alert("Erro", "Token não encontrado. Por favor, faça login novamente.");
        }
      } catch (error) {
        console.log("Erro ao buscar o token:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcess) {
      fetchOcorrencias();
    }
  }, [tokenAcess]);

  const fetchOcorrencias = async () => {
    if (!tokenAcess) return;

    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/ocorrencia");
      if (response.status === 200) {
        const data = response.data;
        setOcorrencias(
          data.map((ocorrencia: any) => ({
            id: ocorrencia.id,
            titulo: ocorrencia.titulo || "Sem título",
            descricao: ocorrencia.descricao || "Sem descrição",
            data: ocorrencia.data || "Data não disponível",
            status: ocorrencia.status || "pendente",
          }))
        );
      } else {
        Alert.alert("Erro", "Não foi possível carregar as ocorrências.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Sessão Expirada", "Por favor, faça login novamente.");
      } else {
        Alert.alert("Erro", "Ocorreu um problema ao buscar as ocorrências.");
      }
    }
  };

  const criarOcorrencia = async () => {
    if (!tokenAcess) return;

    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.post("/ocorrencia/novo", novaOcorrencia);

      if (response.status === 201) {
        Alert.alert("Sucesso", "Ocorrência criada com sucesso.");
        fetchOcorrencias(); // Atualiza a lista
        setNovaOcorrencia({ tipo: "", titulo: "", descricao: "" }); // Limpa o formulário
      } else {
        Alert.alert("Erro", "Não foi possível criar a ocorrência.");
      }
    } catch (error) {
      console.log("Erro ao criar ocorrência:", error);
      Alert.alert("Erro", "Ocorreu um problema ao criar a ocorrência.");
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  searchInput: {
    width: "90%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    fontSize: 16,
  },
  ocorrenciaItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  ocorrenciaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ocorrenciaDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  ocorrenciaDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  ocorrenciaStatus: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 5,
  },
  form: {
    width: "90%",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noOcorrencias: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
});
