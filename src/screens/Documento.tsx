import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app";
import * as DocumentPicker from "expo-document-picker";

interface Documento {
  id: string;
  titulo: string;
  categoria: string;
  url: string;
}

const Documentos = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcess, setTokenAcess] = useState<string | null>(null);

  // Busca o token do usuário ao carregar o componente
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setTokenAcess(storedToken);
    };
    getToken();
  }, []);

  // Faz a requisição para buscar documentos se o token estiver disponível
  useEffect(() => {
    if (tokenAcess) {
      fetchDocumentos(tokenAcess);
    }
  }, [tokenAcess]);

  const fetchDocumentos = async (tokenAcess: string) => {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${tokenAcess}`;
      const response = await api.get("/documento/buscar-todos");
      const data = response.data;

      if (data) {
        setDocumentos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os documentos.");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await api.get(`/documento/${id}/download`, {
        responseType: "blob", // Ou "arraybuffer" dependendo do formato do arquivo
      });
      // Implementação adicional para salvar o arquivo pode ser feita aqui
      Alert.alert("Sucesso", `Download concluído para o documento com ID: ${id}`);
    } catch (error) {
      console.error("Erro ao baixar documento:", error);
      Alert.alert("Erro", "Não foi possível realizar o download.");
    }
  };

 

  return (
    <View style={styles.container}>

      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar documentos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Lista de documentos */}
      <FlatList
        data={documentos.filter((doc) =>
          doc.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.documentItem}>
            <Text style={styles.documentTitle}>{item.titulo}</Text>
            <Text>{`Categoria: ${item.categoria}`}</Text>
            <Button title="Download" onPress={() => handleDownload(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noDocuments}>Nenhum documento encontrado</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  documentItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noDocuments: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default Documentos;
