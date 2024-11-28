import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import api from "../app"; // Certifique-se de que o `api` está configurado corretamente
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ocorrencias {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  status: string;
}

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencias[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);

  const fetchOcorrencias = async () => {
    if (!tokenAcess) {
      console.log("Token não disponível");
      return;
    }

    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/ocorrencia");

      if (response.status === 200) {
        const data = response.data;
        console.log("Ocorrências carregadas:", data); // Log para depuração
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
        console.log("Erro ao buscar ocorrências:", response.statusText);
        Alert.alert("Erro", "Não foi possível carregar as ocorrências.");
      }
    } catch (error) {
      console.log("Erro ao buscar ocorrências:", error);
      Alert.alert("Erro", "Ocorreu um problema ao buscar as ocorrências.");
    }
  };

  const marcarComoResolvida = async (idOcorrencia: string) => {
    try {
      const response = await api.put(`/ocorrencia/${idOcorrencia}`, { status: "resolvida" });

      if (response.status === 200) {
        setOcorrencias((prevOcorrencias) =>
          prevOcorrencias.map((ocorrencia) =>
            ocorrencia.id === idOcorrencia ? { ...ocorrencia, status: "resolvida" } : ocorrencia
          )
        );
      } else {
        console.log("Erro ao marcar ocorrência como resolvida:", response.statusText);
        Alert.alert("Erro", "Falha ao marcar a ocorrência como resolvida.");
      }
    } catch (error) {
      console.log("Erro ao marcar ocorrência como resolvida:", error);
      Alert.alert("Erro", "Não foi possível atualizar a ocorrência.");
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (tokenAcess) {
      fetchOcorrencias();
    }
  }, [tokenAcess]);

  const filteredOcorrencias = ocorrencias.filter(
    (ocorrencia) =>
      ocorrencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ocorrencia.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOcorrencia = ({ item }: { item: Ocorrencias }) => (
    <View style={styles.ocorrenciaItem}>
      <Text style={styles.ocorrenciaTitle}>{item.titulo}</Text>
      <Text style={styles.ocorrenciaDescription}>{item.descricao}</Text>
      <Text style={styles.ocorrenciaDate}>{item.data}</Text>
      <Text style={styles.ocorrenciaStatus}>{item.status}</Text>
      {item.status !== "resolvida" && (
        <TouchableOpacity onPress={() => marcarComoResolvida(item.id)} style={styles.markAsResolvedButton}>
          <Text style={styles.markAsResolvedText}>Marcar como resolvida</Text>
        </TouchableOpacity>
      )}
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
        data={filteredOcorrencias}
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
