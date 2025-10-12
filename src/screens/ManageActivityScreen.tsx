import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFallbackIconForKid } from '../utils/kidUtils';
import { AppContext } from '../context/AppContext';
import { Activity, NewActivity } from '../types/Activity';
import ActivityList from '../components/activity/ActivityList';
import ActivityForm from '../components/activity/ActivityForm';
import AppText from '../components/AppText';

export default function ManageActivityScreen() {
  const {
    activities,
    kids,
    addNewActivity,
    updateExistingActivity,
    deleteExistingActivity,
  } = useContext(AppContext)!;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(
    undefined
  );
  const [selectedKidFilter, setSelectedKidFilter] = useState<string | null>(
    null
  );

  const todayActivities = activities.filter((a) => {
    const isToday =
      new Date(a.timestamp).toDateString() === new Date().toDateString();
    const matchesKid = selectedKidFilter ? a.kidId === selectedKidFilter : true;
    return isToday && matchesKid;
  });

  const generateUniqueId = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  const handleSubmit = async (newActivity: NewActivity) => {
    try {
      const fullActivity: Activity = {
        ...newActivity,
        id: editingActivity ? editingActivity.id : generateUniqueId(),
        createdAt: editingActivity ? editingActivity.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      if (editingActivity) {
        await updateExistingActivity(editingActivity.id, fullActivity);
        console.log('Activity updated:', fullActivity);
      } else {
        await addNewActivity(fullActivity);
        console.log('Activity added:', fullActivity);
      }

      setModalVisible(false);
      setEditingActivity(undefined);
    } catch (error: unknown) {
      console.error('Error saving activity:', error);
      Alert.alert(
        'Error saving activity',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExistingActivity(id);
              console.log('Deleted activity id:', id);
            } catch (error) {
              console.error('Error deleting activity:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText style={styles.title}>Today's Activities</AppText>

        {/* Kid Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kidFilterScroll}
        >
          <Pressable
            onPress={() => setSelectedKidFilter(null)}
            style={styles.kidFilterItem}
          >
            <Icon
              name="account-group"
              size={28}
              color={selectedKidFilter === null ? '#6200ee' : '#999'}
            />
          </Pressable>

          {kids.map((kid) => (
            <Pressable
              key={kid.id}
              onPress={() => setSelectedKidFilter(kid.id)}
              style={styles.kidFilterItem}
            >
              {kid.photoUri ? (
                <Image
                  source={{ uri: kid.photoUri }}
                  style={[
                    styles.kidFilterPhoto,
                    selectedKidFilter === kid.id &&
                      styles.kidFilterPhotoSelected,
                  ]}
                />
              ) : (
                <Icon
                  name={getFallbackIconForKid(kid.id)}
                  size={28}
                  color={selectedKidFilter === kid.id ? '#6200ee' : '#999'}
                  style={styles.kidFilterFallbackIcon}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Activity List */}
      <ActivityList
        activities={todayActivities}
        onEdit={(activity) => {
          setEditingActivity(activity);
          setModalVisible(true);
        }}
        onDelete={handleDelete}
      />

      {/* Floating Add Button */}
      {!modalVisible && (
        <View style={styles.fabContainer}>
          <Pressable
            onPress={() => {
              setEditingActivity(undefined);
              setModalVisible(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Add Activity"
          >
            <AppText style={styles.fab}>➕ Add Activity</AppText>
          </Pressable>
        </View>
      )}

      {/* Modal for Activity Form */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setEditingActivity(undefined);
        }}
      >
        <ActivityForm
          existingActivity={editingActivity}
          onCancel={() => {
            setModalVisible(false);
            setEditingActivity(undefined);
          }}
          onSubmit={handleSubmit}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  headerRow: { marginBottom: 12 },
  kidFilterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kidFilterItem: {
    marginLeft: 8,
  },
  kidFilterPhoto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  kidFilterPhotoSelected: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  kidFilterFallbackIcon: {
    width: 28,
    height: 28,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#eee',
    borderRadius: 14,
    padding: 2,
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
