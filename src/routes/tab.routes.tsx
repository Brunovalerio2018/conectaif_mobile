import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { Feather } from '@expo/vector-icons';
import { Alert, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Perfil from "../screens/Perfil";
import Ocorrencias from "../screens/Ocorrencias";
import Reunioes from "../screens/Reunioes";
import Documentos from "../screens/Documento";
import Notificacoes from "../screens/Notificacoes";
import { useNavigation } from "@react-navigation/native";

const colors = {
  primaryGreen: '#359830',
  activeRed: '#7CFC00',
  white: '#ffffff',
  darkGray: '#333333',
  lightGray: '#f2f2f2',
};

const DrawerIcon = (name: string, color: string) => (
  <Feather name={name} size={24} color={color} />
);

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      setTimeout(async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        setIsLoggingOut(false);
      }, 5000);
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
        },
        drawerItemStyle: { marginVertical: 8 },
      }}
    >
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
        name="Reuniões"
        component={Reunioes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("calendar", color),
        }}
      />
      <Drawer.Screen
        name="Documentos"
        component={Documentos}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("file-text", color),
        }}
      />
      <Drawer.Screen
        name="Notificaes"
        component={Notificacoes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("bell", color),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={() => null}
        options={{
          drawerLabel: () => (
            <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
              {isLoggingOut ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.loadingText}>Saindo...</Text>
                </View>
              ) : (
                <View style={styles.logoutContent}>
                  <Feather name="log-out" size={24} color={colors.white} />
                  <Text style={styles.logoutText}>Sair</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
          drawerIcon: () => null,
        }}
      />
      <Drawer.Screen
        name="LogoFooter"
        component={() => null}
        options={{
          drawerLabel: () => (
            <View style={styles.footerContainer}>
              <Image
                source={require('../../assets/logoConectaIF_branco.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryGreen,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  logoutLogo: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 20,
    color: colors.primaryGreen,
    fontSize: 14,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 220,
    height: 650,
  },
});
