import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { Activity, ActivityType } from '../types/Activity';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack param list with expected params for each route
type RootStackParamList = {
  ManageActivity: undefined;
  AddEditActivity: {
    activity?: Activity;
    kidId?: string | null;
  };
  // add other routes here if needed
};

// Type the navigation prop for this screen
type ManageActivityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManageActivity'
>;

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  feeding: 'food-apple',
  sleep: 'bed',
  diaper: 'baby',
  bath: 'bathtub',
  medication: 'pill',
  note: 'note-text',
  milestone: 'star',
};

export default function ManageActivityScreen() {
  const navigation = useNavigation<ManageActivityScreenNavigationProp>();
  const {
    kids,
    activities,
    reloadActivities,
    deleteExistingActivity,
    selectedKid,
    setSelectedKid,
  } = useContext(AppContext)!;

  const [filteredKid, setFilteredKid] = useState<string | null>(null); // kid id filter
  const [showKidSelectModal, setShowKidSelectModal] = useState(false);

  // Filter activities to only today and filtered kid if set
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const filteredActivities = activities.filter((act) => {
    const ts = new Date(act.timestamp);
    if (ts < todayStart || ts > todayEnd) return false;
    if (filteredKid && act.kidId !== filteredKid) return false;
    return true;
  });

  useEffect(() => {
    reloadActivities();
  }, []);

  // Delete confirmation
  const confirmDeleteActivity = (id: string) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteExistingActivity(id);
            await reloadActivities();
          },
        },
      ]
    );
  };

  // Navigate to form for add/edit
  function goToForm(activity?: Activity) {
    navigation.navigate('AddEditActivity', {
      activity,
      kidId: filteredKid || null,
    });
  }

  // Kid card inside modal
  const KidCard = ({ kid }: { kid: (typeof kids)[0] }) => (
    <TouchableOpacity
      style={styles.kidCard}
      onPress={() => {
        setFilteredKid(kid.id);
        setSelectedKid(kid);
        setShowKidSelectModal(false);
      }}
    >
      {kid.photoUri ? (
        <Image source={{ uri: kid.photoUri }} style={styles.kidPhoto} />
      ) : (
        <View style={[styles.kidPhoto, styles.kidPhotoPlaceholder]}>
          <Text style={{ fontSize: 18, color: '#666' }}>
            {kid.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.kidName}>{kid.name}</Text>
    </TouchableOpacity>
  );

  // Activity card
  const ActivityCard = ({ activity }: { activity: Activity }) => {
    const kid = kids.find((k) => k.id === activity.kidId);
    if (!kid) return null;

    return (
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View style={styles.kidInfo}>
            {kid.photoUri ? (
              <Image source={{ uri: kid.photoUri }} style={styles.kidThumb} />
            ) : (
              <View style={[styles.kidThumb, styles.kidPhotoPlaceholder]}>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  {kid.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.kidNameSmall}>{kid.name}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => goToForm(activity)}>
              <Icon name="square-edit-outline" size={24} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => confirmDeleteActivity(activity.id)}
            >
              <Icon name="delete-outline" size={24} color="#b00020" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.activityBody}>
          <Icon
            name={ACTIVITY_ICONS[activity.type]}
            size={30}
            color="#6200ee"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.activityType}>{activity.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(activity.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter & Select Kid */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowKidSelectModal(true)}
        >
          <Text style={{ color: filteredKid ? '#fff' : '#6200ee' }}>
            {filteredKid
              ? kids.find((k) => k.id === filteredKid)?.name || 'Select Kid'
              : 'Select Kid'}
          </Text>
        </TouchableOpacity>

        {filteredKid && (
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: '#b00020' }]}
            onPress={() => setFilteredKid(null)}
          >
            <Text style={{ color: '#fff' }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activities list */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>
              No activities for today{filteredKid ? ' for selected kid' : ''}.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add Activity button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (!filteredKid) {
            setShowKidSelectModal(true);
          } else {
            goToForm();
          }
        }}
      >
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>

      {/* Kid Select Modal */}
      <Modal
        visible={showKidSelectModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Kid</Text>
            <FlatList
              data={kids}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={({ item }) => <KidCard kid={item} />}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
            <TouchableOpacity
              onPress={() => setShowKidSelectModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={{ color: '#6200ee' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 12 },
  filterButton: {
    flex: 1,
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  activityCard: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kidInfo: { flexDirection: 'row', alignItems: 'center' },
  kidThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  kidPhotoPlaceholder: { backgroundColor: '#ccc' },
  kidNameSmall: { fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center' },

  activityBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  activityType: { fontSize: 16, fontWeight: 'bold' },
  timestamp: { fontSize: 12, color: '#666', textAlign: 'right' },

  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    alignSelf: 'center',
  },

  kidCard: {
    flex: 1,
    margin: 6,
    alignItems: 'center',
  },
  kidPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  kidName: {
    marginTop: 6,
    fontWeight: '600',
  },
});
