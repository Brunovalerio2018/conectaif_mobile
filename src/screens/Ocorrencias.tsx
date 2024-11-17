import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import api from "../app";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ocorrencias {
  id: string;
  titulo: string;
  descricao: string;
  data: string; // Data da ocorrência
  status: string; // Status da ocorrência (pendente, resolvida, etc.)
}

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencias[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Para busca de ocorrências
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);

  // Função para buscar as ocorrências da API
  const fetchOcorrencias = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/ocorrencias");
      const data = response.data;

      if (data) {
        setOcorrencias(
          data.map((ocorrencia: any) => ({
            id: ocorrencia.id,
            titulo: ocorrencia.titulo || "",
            descricao: ocorrencia.descricao || "",
            data: ocorrencia.data || "",
            status: ocorrencia.status || "pendente", // Default para pendente
          }))
        );
      } else {
        console.log("Erro ao buscar ocorrências:", data.message);
      }
    } catch (error) {
      console.log("Erro ao buscar ocorrências:", error);
    }
  };

  // Função para alterar o status da ocorrência
  const marcarComoResolvida = async (idOcorrencia: string) => {
    try {
      await api.put(`/ocorrencias/${idOcorrencia}/marcar-resolvida`);
      setOcorrencias((prevOcorrencias) =>
        prevOcorrencias.map((ocorrencia) =>
          ocorrencia.id === idOcorrencia ? { ...ocorrencia, status: "resolvida" } : ocorrencia
        )
      );
    } catch (error) {
      console.log("Erro ao marcar ocorrência como resolvida:", error);
      Alert.alert("Erro", "Falha ao marcar ocorrência como resolvida.");
    }
  };

  // Buscando o token na AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken); // Atualiza o estado do token
    };

    getToken();
  }, []); // A dependência está vazia para buscar o token uma vez ao carregar o componente

  useEffect(() => {
    if (tokenAcess) {
      fetchOcorrencias(tokenAcess); // Carregar as ocorrências ao ter o token
    } else {
      console.log("Token não encontrado");
    }
  }, [tokenAcess]); // Dependência de tokenAcess para atualizar as ocorrências

  // Filtra as ocorrências com base na pesquisa
  const filteredOcorrencias = ocorrencias.filter((ocorrencia) =>
    ocorrencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ocorrencia.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renderiza as ocorrências
  const renderOcorrencia = ({ item }: { item: Ocorrencias }) => (
    <View style={styles.ocorrenciaItem}>
      <Text style={styles.ocorrenciaTitle}>{item.titulo}</Text>
      <Text style={styles.ocorrenciaDescription}>{item.descricao}</Text>
      <Text style={styles.ocorrenciaDate}>{item.data}</Text> {/* Exibe a data */}
      <Text style={styles.ocorrenciaStatus}>{item.status}</Text> {/* Exibe o status */}

      {item.status !== "resolvida" && (
        <TouchableOpacity onPress={() => marcarComoResolvida(item.id)} style={styles.markAsResolvedButton}>
          <Text style={styles.markAsResolvedText}>Marcar como resolvida</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ocorrências..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Atualiza o estado de bus
      />

      <Text style={styles.sectionTitle}>Pendentes</Text>
      <FlatList
        data={filteredOcorrencias.filter((ocorrencia) => ocorrencia.status === "pendente")}
        renderItem={renderOcorrencia}
        keyExtractor={(item) => item.id}
        style={styles.ocorrenciaList}
        ListEmptyComponent={<Text style={styles.noOcorrencias}>Nenhuma ocorrência pendente</Text>}
      />

      <Text style={styles.sectionTitle}>Resolvidas</Text>
      <FlatList
        data={filteredOcorrencias.filter((ocorrencia) => ocorrencia.status === "resolvida")}
        renderItem={renderOcorrencia}
        keyExtractor={(item) => item.id}
        style={styles.ocorrenciaList}
        ListEmptyComponent={<Text style={styles.noOcorrencias}>Nenhuma ocorrência resolvida</Text>}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  ocorrenciaList: {
    width: "90%",
  },
  ocorrenciaItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  markAsResolvedButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  markAsResolvedText: {
    color: "#fff",
    fontSize: 14,
  },
  noOcorrencias: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
});
