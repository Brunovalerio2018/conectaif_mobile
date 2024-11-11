
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginHome from '../screens/Principal/Login';
import RecuperarConta from '../screens/Principal/RecuperarConta';
import TabRoutes from './tab.routes';
import Notificacoes from '../screens/Notificacoes';


const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarConta"
          component={RecuperarConta}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name='TabRoutes' 
          component={TabRoutes} 
          options={{headerShown: false}}
        /> 
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default Routes;
