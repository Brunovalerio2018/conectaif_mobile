import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { Feather } from '@expo/vector-icons';
import Perfil from "../screens/Perfil";
import Grupo from "../screens/Grupo";
import Ocorrencias from "../screens/Ocorrencias";
import Reunioes from "../screens/Reunioes";
import Documentos from "../screens/Documento";
import Notificacoes from "../screens/Notificacoes";

// Definindo as cores de forma centralizada
const colors = {
  primaryGreen: '#359830',
  activeRed: '#7CFC00', // codigo da fonte e icons drawer #7CFC00
  white: '#ffffff',
};

// Função auxiliar para criar os ícones
const DrawerIcon = (name: string, color: string) => (
  <Feather name={name} size={24} color={color} />
);

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true, // Exibe o cabeçalho
        headerStyle: { backgroundColor: colors.primaryGreen }, // Cabeçalho verde
        headerTintColor: colors.white, // Título do cabeçalho em branco
        headerTitleStyle: { fontWeight: 'bold' }, // Estilo do título (negrito)
        drawerActiveTintColor: colors.activeRed, // Cor ativa do item no menu (vermelho)
        drawerInactiveTintColor: colors.white, // Cor inativa do item no menu (branco)
        drawerStyle: { backgroundColor: colors.primaryGreen }, // Fundo verde do drawer
        drawerWidth: 240, // Largura do drawer (ajuste conforme necessário)
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
        name="Grupos"
        component={Grupo}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("users", color),
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
        name="Reunioes"
        component={Reunioes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("calendar", color),
        }}
      />
      <Drawer.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={{
          drawerIcon: ({ color }) => DrawerIcon("bell", color),
        }}
      />
    </Drawer.Navigator>
  );
}