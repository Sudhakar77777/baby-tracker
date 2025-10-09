import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Add Activity" onPress={() => navigation.navigate('AddActivity' as never)} />
      <Button title="Manage Kids" onPress={() => navigation.navigate('ManageKids' as never)} />
    </View>
  );
}
