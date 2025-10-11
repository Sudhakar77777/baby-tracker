import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or your icon lib

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')} // your logo file
        style={styles.logo}
      />

      <View style={styles.textWrapper}>
        <Text style={styles.title}>Baby Tracker</Text>
      </View>

      {navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={24} color="#6200ee" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    paddingRight: 10, // add some padding on right for back button
  },
  backButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 6,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Atma-Bold',
    color: '#6200ee',
  },
  textWrapper: {
    justifyContent: 'center',
    paddingBottom: 5,
  },
});
