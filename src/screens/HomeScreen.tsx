import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import AppText from '../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Section: Activity */}
        <Pressable
          onPress={() => navigation.navigate('Activity')}
          style={({ pressed }) => [
            styles.button,
            styles.activityButton,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="plus-circle-outline" size={36} color="#fff" />
          <AppText style={styles.buttonText}>Track Activity</AppText>
        </Pressable>

        <Pressable
          onPress={() => {
            // Navigate to Reports screen
          }}
          style={({ pressed }) => [
            styles.button,
            styles.reportsButton,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="file-document-outline" size={32} color="#fff" />
          <AppText style={styles.buttonText}>Reports</AppText>
        </Pressable>

        <Pressable
          onPress={() => {
            // Handle download action
          }}
          style={({ pressed }) => [
            styles.button,
            styles.downloadButton,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="download" size={32} color="#fff" />
          <AppText style={styles.buttonText}>Download</AppText>
        </Pressable>

        <View style={styles.separator} />
        <AppText style={styles.setupsLabel}>Setup:</AppText>

        <View style={styles.bottomButtons}>
          <Pressable
            onPress={() => navigation.navigate('Kids')}
            style={({ pressed }) => [
              styles.setupButton,
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="account-child" size={32} color="#fff" />
            <AppText style={styles.setupButtonText}>Kids</AppText>
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.setupButton,
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="pill" size={32} color="#fff" />
            <AppText style={styles.setupButtonText}>Meds</AppText>
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.setupButton,
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="needle" size={32} color="#fff" />
            <AppText style={styles.setupButtonText}>Vaccines</AppText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  activityButton: {
    backgroundColor: '#f48fb1',
  },
  reportsButton: {
    backgroundColor: '#ce93d8',
  },
  downloadButton: {
    backgroundColor: '#81d4fa',
  },
  settingsButton: {
    backgroundColor: '#3a91d8ff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    // fallback for older iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 3, // for Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  separator: {
    borderBottomWidth: 3,
    borderBottomColor: '#ccc',
    marginVertical: 16,
  },
  setupsLabel: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'PatrickHandSC',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  setupButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  setupButtonText: {
    marginTop: 6,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
