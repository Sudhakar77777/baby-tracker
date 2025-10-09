// src/init.ts
import { Platform } from 'react-native';

export function initStorage(): void {
  // For AsyncStorage, there's no schema creation needed
  // But you could run migrations from old storage here
  if (Platform.OS === 'web') {
    console.log('Web: no storage init needed');
    return;
  }
  // Optionally do something on native — but usually not needed
}
