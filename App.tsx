import React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//const Stack = createNativeStackNavigator();

import Routes from './src/routes';

export default function App() {
  return (
    <Routes/>
  );
}
