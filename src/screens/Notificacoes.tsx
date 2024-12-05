import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import "moment/locale/pt-br";
import api from "../app";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificaUser {
  titulo: string;
  descricao: string;
  idusuario: number;
  tpdestinatario: string;
}

export default function Notificacao() {
  const [notificacoes, setNotificacoes] = useState<NotificaUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenAcesso, setTokenAcesso] = useState<string | null>(null);

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
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await api.get("/notificacao");
      const data = response.data;

      if (data) {
        setNotificacoes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const renderNotificacao = ({ item }: { item: NotificaUser }) => (
    <View style={styles.notificacaoItem}>
      <Text style={styles.notificacaoTitulo}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>
      <Text>{`Descricao notificacao: ${item.titulo}`}</Text>
      <Text>{`descricao: ${item.descricao}`}</Text>
 
      
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notificações..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />


      <FlatList
        data={notificacoes.filter((notificacao) =>
          notificacao.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNotificacao}
        ListEmptyComponent={
          <Text style={styles.noNotificacoes}>Nenhuma notificação encontrada</Text>
        }
      />
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
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  notificacaoItem: {
    backgroundColor: "#ADFF2F",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noNotificacoes: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#999",
  },
});
