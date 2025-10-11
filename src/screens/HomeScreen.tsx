import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
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
      {/* Header */}
      <View style={styles.separator} />
      {/* Main Buttons */}
      <View style={styles.content}>
        {/* Top Section: Activity */}
        <TouchableOpacity
          style={[styles.button, styles.activityButton]}
          onPress={() => navigation.navigate('Activity')}
        >
          <Icon name="plus-circle-outline" size={36} color="#fff" />
          <AppText style={styles.buttonText}>Track Activity</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reportsButton]}
          onPress={() => {
            // Navigate to Reports screen
          }}
        >
          <Icon name="file-document-outline" size={32} color="#fff" />
          <AppText style={styles.buttonText}>Reports</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.downloadButton]}
          onPress={() => {
            // Handle download action
          }}
        >
          <Icon name="download" size={32} color="#fff" />
          <AppText style={styles.buttonText}>Download</AppText>
        </TouchableOpacity>

        {/* Bottom Section: Setup */}
        <View style={styles.separator} />

        <AppText style={styles.setupsLabel}>Setup:</AppText>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.setupButton, styles.settingsButton]}
            onPress={() => navigation.navigate('Kids')}
          >
            <Icon name="account-child" size={28} color="#fff" />
            <AppText style={styles.setupButtonText}>Kids</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.setupButton, styles.settingsButton]}
            onPress={() => {}}
          >
            <Icon name="pill" size={28} color="#fff" />
            <AppText style={styles.setupButtonText}>Meds</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.setupButton, styles.settingsButton]}
            onPress={() => {}}
          >
            <Icon name="needle" size={28} color="#fff" />
            <AppText style={styles.setupButtonText}>Vaccines</AppText>
          </TouchableOpacity>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
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
    backgroundColor: '#ce93d8', // purple-ish
  },
  downloadButton: {
    backgroundColor: '#81d4fa', // light blue-ish
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});
