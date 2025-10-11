import { DefaultTheme } from 'react-native-paper';

// TODO: Customize the theme as per your design requirements

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF8800', // your orange
    accent: '#FF8800',
    background: 'transparent',
    surface: 'transparent',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: 'PatrickHandSC' },
    medium: { fontFamily: 'PatrickHandSC' },
    light: { fontFamily: 'PatrickHandSC' },
    thin: { fontFamily: 'PatrickHandSC' },
  },
};
