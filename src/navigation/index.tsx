import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ManageActivityScreen from '../screens/ManageActivityScreen';
import ManageKidsScreen from '../screens/ManageKidsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Activity" component={ManageActivityScreen} />
      <Stack.Screen name="Kids" component={ManageKidsScreen} />
    </Stack.Navigator>
  );
}
