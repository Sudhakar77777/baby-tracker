import { DefaultTheme } from 'react-native-paper';

// TODO: Customize the theme as per your design requirements

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF8800', // your orange
    accent: '#FF8800',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: 'System', fontWeight: '800' }, // normal
    medium: { fontFamily: 'System', fontWeight: '800' }, // semi-bold
    light: { fontFamily: 'System', fontWeight: '800' }, // light
    thin: { fontFamily: 'System', fontWeight: '800' }, // thin
  },
};
