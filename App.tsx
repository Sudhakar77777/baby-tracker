import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AppProvider } from './src/context/AppContext';
import { initDB } from './src/db/init';
import HomeScreen from './src/screens/HomeScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import ManageKidsScreen from './src/screens/ManageKidsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    // <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddActivity" component={AddActivityScreen} />
          <Stack.Screen name="ManageKids" component={ManageKidsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    // </AppProvider>
  );
}
