import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil from '../screens/Perfil';
import Ocorrencias from '../screens/Ocorrencias';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#359830' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Ocorrencias" component={Ocorrencias} />
    </Stack.Navigator>
  );
}
