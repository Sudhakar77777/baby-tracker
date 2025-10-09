import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Kid } from '../types/Kid';

const KIDS_KEY = 'kids_data';

export async function getAllKids(): Promise<Kid[]> {
  const json = await AsyncStorage.getItem(KIDS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addKid(name: string, birthdate: string): Promise<void> {
  const newKid: Kid = {
    id: uuidv4(),
    name,
    birthdate,
  };

  const kids = await getAllKids();
  kids.push(newKid);
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(kids));
}

export async function deleteKid(id: string): Promise<void> {
  const kids = await getAllKids();
  const filtered = kids.filter(k => k.id !== id);
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(filtered));
}

export async function updateKid(id: string, name: string, birthdate: string): Promise<void> {
  const kids = await getAllKids();
  const updated = kids.map(k =>
    k.id === id ? { ...k, name, birthdate } : k
  );
  await AsyncStorage.setItem(KIDS_KEY, JSON.stringify(updated));
}
