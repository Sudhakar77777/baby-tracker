import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Left side: Logo + Title */}
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Baby Tracker</Text>
      </View>

      {/* Back Button (Top Right) */}
      {navigation.canGoBack() && (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={18} color="#6200ee" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // push left and right sections apart
    paddingHorizontal: 12,
    height: 60,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 6,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Atma-Bold',
    color: '#6200ee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fa65cdff',
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  backText: {
    color: '#6200ee',
    fontSize: 16,
    marginLeft: 2,
    fontWeight: '600',
  },
});
