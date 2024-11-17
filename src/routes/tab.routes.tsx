import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { Feather } from '@expo/vector-icons';
import { Alert, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Perfil from "../screens/Perfil";
import Grupo from "../screens/Grupo";
import Ocorrencias from "../screens/Ocorrencias";
import Reunioes from "../screens/Reunioes";
import Documentos from "../screens/Documento";
import Notificacoes from "../screens/Notificacoes";
import { useNavigation } from "@react-navigation/native";

// Definindo as cores de forma centralizada
const colors = {
  primaryGreen: '#359830',
  activeRed: '#7CFC00',
  white: '#ffffff',
  darkGray: '#333333',
  lightGray: '#f2f2f2',
};

// Função auxiliar para criar os ícones
const DrawerIcon = (name: string, color: string) => (
  <Feather name={name} size={24} color={color} />
);

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Função de logout com efeito de carregamento e temporizador
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulando um tempo de espera com um temporizador de 2 segundos
      setTimeout(async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        setIsLoggingOut(false);
      }, 5000); // Diminui o tempo de espera para 5 segundos
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao sair. Tente novamente mais tarde.');
      setIsLoggingOut(false);
    }
  };

  return (
    <Drawer.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: colors.primaryGreen },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: 'bold' },
      drawerActiveTintColor: colors.activeRed,
      drawerInactiveTintColor: colors.white,
      drawerStyle: {
        backgroundColor: colors.primaryGreen,
        width: 240,
        transform: [{ perspective: 800 }, { rotateY: '10deg' }],  // Efeito 3D
      },
      drawerItemStyle: { marginVertical: 8 }, // Espaço entre os itens do menu
    }}
    >
      {/* Seção Principal */}
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("user", color),
        }}
      />
      <Drawer.Screen
        name="Ocorrencias"
        component={Ocorrencias}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("alert-triangle", color),
        }}
      />
      <Drawer.Screen
        name="Reunioes"
        component={Reunioes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("calendar", color),
        }}
      />
      <Drawer.Screen
        name="Grupo"
        component={Grupo}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("users", color),
        }}
      />
      
      {/* Separador entre seções principais e secundárias */}
      <Drawer.Screen
        name="Separador"
        component={() => null}
        options={{
          drawerLabel: () => <View style={styles.separator} />,
        }}
      />

      {/* Seção de Documentos e Notificações */}
      <Drawer.Screen
        name="Documentos"
        component={Documentos}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("file-text", color),
        }}
      />
      <Drawer.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("bell", color),
        }}
      />

      {/* Separador antes do Logout */}
      <Drawer.Screen
        name="Separador2"
        component={() => null}
        options={{
          drawerLabel: () => <View style={styles.separator} />,
        }}
      />

      {/* Logout */}
      <Drawer.Screen
        name="Logout"
        component={() => null}
        options={{
          drawerLabel: () => (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              {isLoggingOut ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.loadingText}>Saindo...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sair</Text>
              )}
            </TouchableOpacity>
          ),
          drawerIcon: ({ color }) => DrawerIcon("log-out", color),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 16,
  },
});
