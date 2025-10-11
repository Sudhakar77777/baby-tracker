import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function BabyBackground({ children, style }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/bg-screen-green-mild.jpg')} // ✅ Make sure this path & filename are correct
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.overlay, style]}>{children}</SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: light white overlay for readability
    // backgroundColor: 'transparent',
  },
});
