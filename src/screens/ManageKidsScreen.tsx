import React, { useContext, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Kid } from '../types/Kid';
import KidsList from '../components/kids/KidsList';
import KidForm from '../components/kids/KidForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { AppContext } from '../context/AppContext';

export default function ManageKidsScreen() {
  const { kids, addNewKid, updateExistingKid, deleteExistingKid, reloadKids } =
    useContext(AppContext)!;

  const [loading, setLoading] = useState(false);
  const [editingKid, setEditingKid] = useState<Kid | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const handleSaveKid = useCallback(
    async (kid: Omit<Kid, 'id'>, id?: string) => {
      setLoading(true);
      try {
        if (id) {
          await updateExistingKid(id, kid);
        } else {
          await addNewKid(kid);
        }
        // reloadKids might be unnecessary if context updates on its own
        await reloadKids();
        setIsFormVisible(false);
        setEditingKid(null);
      } catch (error) {
        console.error('Failed to save kid:', error);
      } finally {
        setLoading(false);
      }
    },
    [addNewKid, updateExistingKid, reloadKids]
  );

  const handleDeleteKid = useCallback(
    (id: string) => {
      setConfirmationData({
        visible: true,
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this kid?',
        onConfirm: async () => {
          setLoading(true);
          try {
            await deleteExistingKid(id);
            await reloadKids();
          } catch (error) {
            console.error('Failed to delete kid', error);
          } finally {
            setLoading(false);
            setConfirmationData((prev) => ({ ...prev, visible: false }));
          }
        },
        onCancel: () =>
          setConfirmationData((prev) => ({ ...prev, visible: false })),
      });
    },
    [deleteExistingKid, reloadKids]
  );

  const openAddForm = useCallback(() => {
    setEditingKid(null);
    setIsFormVisible(true);
  }, []);

  const openEditForm = useCallback((kid: Kid) => {
    setEditingKid(kid);
    setIsFormVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6200ee" />
          <AppText style={{ textAlign: 'center' }}>Loading...</AppText>
        </View>
      )}

      <AppText style={styles.title}>Kids List:</AppText>

      <KidsList
        kids={kids}
        onEdit={openEditForm}
        onDelete={handleDeleteKid}
        loading={loading}
      />

      {!isFormVisible && !loading && (
        <View style={styles.fabContainer}>
          <AppText
            onPress={openAddForm}
            style={styles.fab}
            accessibilityRole="button"
            accessibilityLabel="Add Kid"
          >
            ➕ Add Kid
          </AppText>
        </View>
      )}

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
  loading: {
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: '600',
  },
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
