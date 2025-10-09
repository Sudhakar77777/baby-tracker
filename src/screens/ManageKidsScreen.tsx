// ManageKidsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Kid } from '../types/Kid';
import { addKid, getAllKids, deleteKid, updateKid } from '../storage/kids';
import dayjs from 'dayjs';
import KidsList from '../components/KidsList';
import KidForm from '../components/KidForm';
import ConfirmationModal from '../components/ConfirmationModal';

export default function ManageKidsScreen() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingKid, setEditingKid] = useState<Kid | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [confirmationData, setConfirmationData] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Load kids list from storage
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

  useEffect(() => {
    loadKids();
  }, []);

  // Add or update kid handler
  const handleSaveKid = async (kid: Omit<Kid, 'id'>, id?: string) => {
    setLoading(true);
    try {
      if (id) {
        await updateKid(id, kid.name, kid.birthdate, kid.gender, kid.photoUri);
      } else {
        await addKid(kid.name, kid.birthdate, kid.gender, kid.photoUri);
      }
      await loadKids();
      setIsFormVisible(false);
      setEditingKid(null);
    } catch (error) {
      console.error('Failed to save kid', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete kid handler
  const handleDeleteKid = (id: string) => {
    setConfirmationData({
      visible: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this kid?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteKid(id);
          await loadKids();
        } catch (error) {
          console.error('Failed to delete kid', error);
        } finally {
          setLoading(false);
          setConfirmationData((prev) => ({ ...prev, visible: false }));
        }
      },
      onCancel: () => {
        setConfirmationData((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  // Open form for adding new kid
  const openAddForm = () => {
    setEditingKid(null);
    setIsFormVisible(true);
  };

  // Open form for editing existing kid
  const openEditForm = (kid: Kid) => {
    setEditingKid(kid);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        </View>
      )}

      <Text style={styles.title}>Kids List:</Text>

      <KidsList
        kids={kids}
        onEdit={openEditForm}
        onDelete={handleDeleteKid}
        loading={loading}
      />

      {/* Add Kid Floating Button */}
      {!isFormVisible && (
        <View style={styles.fabContainer}>
          <Text
            onPress={openAddForm}
            style={styles.fab}
            accessibilityRole="button"
            accessibilityLabel="Add Kid"
          >
            ➕ Add Kid
          </Text>
        </View>
      )}

      {/* Kid Add/Edit Form */}
      {isFormVisible && (
        <KidForm
          kid={editingKid}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingKid(null);
          }}
          onSave={handleSaveKid}
          loading={loading}
        />
      )}

      {/* Generic Confirmation Modal */}
      <ConfirmationModal
        visible={confirmationData.visible}
        title={confirmationData.title}
        message={confirmationData.message}
        onConfirm={confirmationData.onConfirm}
        onCancel={confirmationData.onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loading: { marginVertical: 10 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: '600' },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    fontSize: 24,
    backgroundColor: '#6200ee',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
