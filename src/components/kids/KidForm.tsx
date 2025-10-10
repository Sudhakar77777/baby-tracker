import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Kid } from '../../types/Kid';
import { DatePickerModal } from 'react-native-paper-dates';
import { Button, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';

interface KidFormProps {
  kid: Kid | null;
  onCancel: () => void;
  onSave: (kid: Omit<Kid, 'id'>, id?: string) => void;
  loading: boolean;
}

export default function KidForm({
  kid,
  onCancel,
  onSave,
  loading,
}: KidFormProps) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [photoUri, setPhotoUri] = useState<string>('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Initialize form with kid data if editing
  useEffect(() => {
    if (kid) {
      setName(kid.name || '');
      setBirthdate(kid.birthdate || '');
      setGender(kid.gender ?? 'boy');
      setPhotoUri(kid.photoUri ?? '');

      if (kid.birthdate) {
        const parsed = dayjs(kid.birthdate);
        setDate(parsed.isValid() ? parsed.toDate() : undefined);
      } else {
        setDate(undefined);
      }
    } else {
      resetForm();
    }
  }, [kid]);

  const resetForm = () => {
    setName('');
    setBirthdate('');
    setGender('boy');
    setPhotoUri('');
    setDate(undefined);
  };

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

  const handleSave = () => {
    if (!name || !birthdate) return;
    onSave({ name, birthdate, gender, photoUri }, kid?.id);
  };

  return (
    <View style={styles.modalContent}>
      {/* Title */}
      <Text style={styles.modalTitle}>{kid ? 'Edit Kid' : 'Add Kid'}</Text>
      {/* Name */}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {/* Photo Picker */}
      <Button
        mode="outlined"
        onPress={pickImage}
        buttonColor="#FF9800"
        textColor="#fff"
        labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
      >
        Pick Photo
      </Button>
      <View style={{ height: 10 }} />
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
      ) : null}
      {/* Birthdate Picker */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date}
        onConfirm={({ date }) => {
          setOpenDatePicker(false);
          setDate(date);
          setBirthdate(dayjs(date).format('YYYY-MM-DD'));
        }}
      />
      <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
        <TextInput
          placeholder="Birthdate"
          value={birthdate}
          editable={false}
          style={[styles.input, styles.disabledInput]}
        />
      </TouchableOpacity>
      {/* Gender */}
      <Text style={{ marginTop: 10 }}>Gender:</Text>
      <RadioButton.Group
        onValueChange={(value) => setGender(value as 'boy' | 'girl' | 'other')}
        value={gender}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton.Item label="Boy" value="boy" />
          <RadioButton.Item label="Girl" value="girl" />
          <RadioButton.Item label="Other" value="other" />
        </View>
      </RadioButton.Group>
      {/* Save & Cancel Buttons */}
      <View style={{ marginTop: 10 }}>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!name || !birthdate || loading}
          buttonColor="blue"
          textColor="#fff"
          labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
        >
          {kid ? 'Update Kid' : 'Add Kid'}
        </Button>
        <View style={{ marginTop: 10 }}>
          <Button
            mode="contained"
            onPress={onCancel}
            buttonColor="gray"
            textColor="#fff"
            labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            disabled={loading}
          >
            Cancel
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
