// screens/Documentos.tsx

import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';

const Documentos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documentos</Text>
      <Button title="Upload de Documento" onPress={() => {/* Navegar para tela de upload */}} />

      {/* Campo de busca */}
      <TextInput style={styles.searchInput} placeholder="Buscar documentos..." />

      {/* Lista de documentos */}
      <FlatList
        data={''}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.documentItem}>
            <Text>{item}</Text>
            <Button title="Download" onPress={() => {/* Função de download */}} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20
   },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  searchInput: { 
    padding: 10, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  documentItem: { 
    marginVertical: 10, 
    padding: 15, 
    backgroundColor: '#f2f2f2', 
    borderRadius: 8 
  }
});

export default Documentos;
