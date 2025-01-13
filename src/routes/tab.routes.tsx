import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import * as React from "react";
import { Feather } from '@expo/vector-icons';
import { Alert, Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Perfil from "../screens/Perfil";
import Ocorrencias from "../screens/Ocorrencias";
import Reunioes from "../screens/Reunioes";
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
  const [dots, setDots] = React.useState(".");

  React.useEffect(() => {
    if (isLoggingOut) {
      const interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length < 5) {
            return prevDots + ".";
          } else {
            return ".";
          }
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoggingOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setTimeout(() => {
        navigation.navigate('Login');
        setIsLoggingOut(false);
      }, 3000); // 3 segundos de atraso antes de navegar para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao sair. Tente novamente mais tarde.');
      setIsLoggingOut(false);
    }
  };

  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <DrawerItemList {...props} />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logoConectaIF_branco.png')} // Substitua pelo caminho do seu logo
          style={styles.logo}
        />
      </View>
    </DrawerContentScrollView>
  );

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primaryGreen },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: colors.activeRed,
        drawerInactiveTintColor: colors.white,
        drawerStyle: {
          backgroundColor: colors.primaryGreen,
          width: 255,
        },
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
        name="Notificação"
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
                  <View style={styles.spinner}></View>
                  <Text style={styles.loadingText}>Saindo{dots}</Text>
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
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 500,
    resizeMode: 'contain',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.activeRed,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 20,
    color: colors.white,
    fontSize: 18,
  },
  spinner: {
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: colors.primaryGreen,
    borderTopColor: '#98FB98',
    borderRadius: 50,
    animation: 'spin 1s linear infinite',
  },
});
