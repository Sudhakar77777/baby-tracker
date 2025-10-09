// src/storage/kids.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Kid } from '../types/Kid';

const KIDS_KEY = 'kids_list';

export async function getAllKids(): Promise<Kid[]> {
  try {
    const json = await AsyncStorage.getItem(KIDS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error('Error reading kids from storage:', err);
    return [];
  }
}

export async function addKid(
  name: string,
  birthdate: string,
  gender: 'boy' | 'girl' | 'other',
  photoUri?: string
): Promise<Kid> {
  const newKid: Kid = {
    id: uuidv4(),
    name,
    birthdate,
    gender,
    photoUri,
  };
  const existing = await getAllKids();
  const updated = [...existing, newKid];
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(updated));
  return newKid;
}

export async function deleteKid(id: string): Promise<void> {
  const existing = await getAllKids();
  const filtered = existing.filter((k) => k.id !== id);
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(filtered));
}

export async function updateKid(
  id: string,
  name: string,
  birthdate: string,
  gender: 'boy' | 'girl' | 'other',
  photoUri?: string
): Promise<void> {
  const existing = await getAllKids();
  const updated = existing.map((k) =>
    k.id === id ? { id, name, birthdate, gender, photoUri } : k
  );
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(updated));
}
