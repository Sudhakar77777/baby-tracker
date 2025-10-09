import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { addKid, getAllKids, deleteKid, updateKid } from '../storage/kids';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { List, IconButton, Divider, RadioButton } from 'react-native-paper';
import { Kid } from '../types/Kid';
import dayjs from 'dayjs';

export default function ManageKidsScreen() {
  // State variables
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [photoUri, setPhotoUri] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [kids, setKids] = useState<Kid[]>([]);
  const [editingKidId, setEditingKidId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadKids = async () => {
    setLoading(true);
    try {
      const data = await getAllKids();
      setKids(data);
    } catch (error) {
      console.error('Failed to load kids', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAddKid = async () => {
    if (!name || !birthdate) return;

    setLoading(true);
    try {
      if (editingKidId) {
        await updateKid(editingKidId, name, birthdate, gender, photoUri);
        setEditingKidId(null);
      } else {
        await addKid(name, birthdate, gender, photoUri);
      }

      setName('');
      setBirthdate('');
      setGender('boy');
      setPhotoUri('');
      await loadKids();
    } catch (error) {
      console.error('Failed to add/update kid', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kid: Kid) => {
    try {
      if (!kid || !kid.id) throw new Error('Invalid kid data');

      setEditingKidId(kid.id);
      setName(kid.name || '');

      // Validate birthdate, fallback if invalid
      const parsedDate = kid.birthdate ? dayjs(kid.birthdate) : null;
      if (parsedDate && parsedDate.isValid()) {
        setBirthdate(kid.birthdate);
        setDate(parsedDate.toDate());
      } else {
        setBirthdate('');
        setDate(undefined);
      }

      setGender(kid.gender ?? 'boy');
      setPhotoUri(kid.photoUri ?? '');
    } catch (error) {
      console.error('Failed to handle edit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this kid?')) return;

    setLoading(true);
    try {
      await deleteKid(id);
      await loadKids();
    } catch (error) {
      console.error('Failed to delete kid', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKids();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {loading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        </View>
      )}

      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        {editingKidId ? 'Edit Kid' : 'Add Kid'}
      </Text>

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

      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={date}
        onConfirm={(params) => {
          setOpen(false);
          setDate(params.date);
          setBirthdate(dayjs(params.date).format('YYYY-MM-DD'));
        }}
      />
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          placeholder="Birthdate"
          value={birthdate}
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 10,
            borderRadius: 5,
            backgroundColor: '#f9f9f9',
          }}
        />
      </TouchableOpacity>

      {/* Gender Selection */}
      <Text style={{ marginTop: 10 }}>Gender:</Text>
      <RadioButton.Group
        onValueChange={(value: string) =>
          setGender(value as 'boy' | 'girl' | 'other')
        }
        value={gender}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton.Item label="Boy" value="boy" />
          <RadioButton.Item label="Girl" value="girl" />
          <RadioButton.Item label="Other" value="other" />
        </View>
      </RadioButton.Group>

      {/* Photo Upload */}
      <Button title="Pick Photo" onPress={pickImage} />

      {/* Photo Preview */}
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginVertical: 10,
          }}
        />
      ) : null}

      <Button
        title={editingKidId ? 'Update Kid' : 'Add Kid'}
        onPress={handleAddKid}
        disabled={!name || !birthdate || loading}
      />

      {editingKidId && (
        <Button
          title="Cancel Edit"
          onPress={() => {
            setEditingKidId(null);
            setName('');
            setBirthdate('');
            setGender('boy');
            setPhotoUri('');
          }}
          color="gray"
          disabled={loading}
        />
      )}

      <Text style={{ fontSize: 18, marginTop: 20 }}>Kids List:</Text>

      {loading ? <ActivityIndicator size="large" color="#6200ee" /> : null}

      <FlatList
        data={kids}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <List.Item
            title={`${index + 1}. ${item.name} — ${dayjs(item.birthdate).format(
              'MMM D, YYYY'
            )}`}
            description={
              item.gender
                ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
                : undefined
            }
            left={(props) =>
              item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={{ width: 40, height: 40, borderRadius: 20, margin: 8 }}
                />
              ) : (
                <List.Icon
                  {...props}
                  icon={
                    item.gender === 'boy'
                      ? 'baby-bottle-outline'
                      : item.gender === 'girl'
                      ? 'baby-carriage'
                      : 'baby-face-outline'
                  }
                />
              )
            }
            right={(props) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                  {...props}
                  icon="pencil"
                  onPress={() => handleEdit(item)}
                  disabled={loading}
                />
                <IconButton
                  {...props}
                  icon="delete"
                  onPress={() => handleDelete(item.id)}
                  disabled={loading}
                />
              </View>
            )}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}
