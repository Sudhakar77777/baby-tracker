import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { initStorage } from './src/storage/init';
import { registerTranslation } from 'react-native-paper-dates';
import { en } from './locales';
import { customTheme } from './theme';
import AppNavigator from './src/navigation';

const Stack = createNativeStackNavigator();

registerTranslation('en', en);

export default function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <AppProvider>
      <PaperProvider theme={customTheme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}
