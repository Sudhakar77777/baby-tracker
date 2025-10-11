import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { initStorage } from './src/storage/init';
import { registerTranslation } from 'react-native-paper-dates';
import { en } from './locales';
import { customTheme } from './theme';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation';
import BabyBackground from './src/components/BabyBackground';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

registerTranslation('en', en);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Storage initialization
    initStorage();
    // Font loading
    async function loadFonts() {
      await Font.loadAsync({
        'Atma-Regular': require('./assets/fonts/Atma-Regular.ttf'),
        'Atma-Bold': require('./assets/fonts/Atma-Bold.ttf'),
        CaveatBrush: require('./assets/fonts/CaveatBrush-Regular.ttf'),
        PatrickHandSC: require('./assets/fonts/PatrickHandSC-Regular.ttf'),
        // 'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        // 'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or splash screen
  }

  return (
    <AppProvider>
      <PaperProvider theme={customTheme}>
        <BabyBackground>
          <NavigationContainer theme={navTheme}>
            <AppNavigator />
          </NavigationContainer>
        </BabyBackground>
      </PaperProvider>
    </AppProvider>
  );
}
