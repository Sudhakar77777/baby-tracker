import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
// import { addKid, getAllKids } from '../db/kids';
import { addKid, getAllKids } from '../storage/kidStorage';
import { Kid } from '../types/Kid';
import dayjs from 'dayjs';

export default function ManageKidsScreen() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [kids, setKids] = useState<Kid[]>([]);

  const loadKids = async () => {
    const data = await getAllKids();
    setKids(data);
  };

  const handleAddKid = async () => {
    if (!name || !birthdate) return;
    await addKid(name, birthdate);
    setName('');
    setBirthdate('');
    loadKids();
};

  useEffect(() => {
    loadKids();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Kid</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Birthdate (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <Button title="Add Kid" onPress={handleAddKid} />

      <Text style={{ fontSize: 18, marginTop: 20 }}>Kids List:</Text>
      <FlatList
        data={kids}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={{ paddingVertical: 5 }}>
            👶 {item.name} — {dayjs(item.birthdate).format('MMM D, YYYY')}
          </Text>
        )}
      />
    </View>
  );
}
