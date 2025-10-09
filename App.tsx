import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
// import { AppProvider } from './src/context/AppContext';
import { initStorage } from './src/storage/init';
import HomeScreen from './src/screens/HomeScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import ManageKidsScreen from './src/screens/ManageKidsScreen';
import { registerTranslation } from 'react-native-paper-dates';
import { en } from './locales';
import { customTheme } from './theme';

const Stack = createNativeStackNavigator();

registerTranslation('en', en);

export default function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <PaperProvider theme={customTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddActivity" component={AddActivityScreen} />
          <Stack.Screen name="ManageKids" component={ManageKidsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
