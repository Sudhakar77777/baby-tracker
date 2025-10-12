import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  ActivityType,
  NewActivity,
  FeedingActivity,
  SleepActivity,
  DiaperActivity,
  BathActivity,
  MedicationActivity,
  NoteActivity,
  MilestoneActivity,
} from '../../types/Activity';
import { AppContext } from '../../context/AppContext';

import FeedingForm from './FeedingForm';
import MedicationForm from './MedicationForm';
import DiaperForm from './DiaperForm';
import SleepForm from './SleepForm';
import BathForm from './BathForm';
import NoteForm from './NoteForm';
import MilestoneForm from './MilestoneForm';
import { initialWindowMetrics } from 'react-native-safe-area-context';

interface Props {
  existingActivity?: NewActivity;
  onSubmit: (activity: NewActivity) => void;
  onCancel: () => void;
}

const screenWidth = Dimensions.get('window').width;
const CARD_3_SIZE = (screenWidth - 12 * 6) / 3; // 3 cards per row
const CARD_5_SIZE = (screenWidth - 12 * 6) / 4; // 5 cards per row

const ActivityForm: React.FC<Props> = ({
  existingActivity,
  onSubmit,
  onCancel,
}) => {
  const { kids } = useContext(AppContext)!;

  const [selectedKid, setSelectedKid] = useState<string | null>(
    existingActivity?.kidId || null
  );
  const [selectedType, setSelectedType] = useState<ActivityType | null>(
    existingActivity?.type || null
  );
  const [formOpen, setFormOpen] = useState<boolean>(!!existingActivity);

  // Add kidId before submitting
  const handleSubmit = (activityData: Omit<NewActivity, 'kidId'>) => {
    if (!selectedKid) {
      alert('Please select a kid');
      return;
    }
    const fullActivity = {
      ...activityData,
      kidId: selectedKid,
    } as NewActivity;
    onSubmit(fullActivity);
    setFormOpen(false);
  };

  // Kid card component
  const KidCard = ({ kid }: { kid: (typeof kids)[0] }) => {
    const hasPhoto = !!kid.photoUri;
    const isSelected = selectedKid === kid.id;

    return (
      <TouchableOpacity
        style={[styles.kidCard, isSelected && styles.kidCardSelected]}
        onPress={() => {
          setSelectedKid(kid.id);
          if (selectedType) setFormOpen(true);
        }}
      >
        {hasPhoto ? (
          <Image source={{ uri: kid.photoUri }} style={styles.kidPhoto} />
        ) : (
          <View style={styles.kidIconContainer}>
            <Icon name="account" size={40} color="#888" />
          </View>
        )}
        <Text style={styles.kidName} numberOfLines={1} ellipsizeMode="tail">
          {kid.name}
        </Text>

        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Icon name="check-circle" size={24} color="#6200ee" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ACTIVITY_ICONS: Record<ActivityType, string> = {
    feeding: 'baby-bottle',
    sleep: 'bed',
    diaper: 'baby',
    bath: 'bathtub',
    medication: 'pill',
    note: 'note-text',
    milestone: 'star',
  };

  // Activity card component
  const ActivityTypeCard = ({
    type,
    selectedType,
    setSelectedType,
    selectedKid,
  }: {
    type: ActivityType;
    selectedType: ActivityType | null;
    setSelectedType: (type: ActivityType) => void;
    selectedKid: string | null;
  }) => {
    const isSelected = selectedType === type;

    const handlePress = () => {
      setSelectedType(type);

      if (selectedKid) {
        console.log('Kid selected:', selectedKid, 'Proceeding to form...');
        setTimeout(() => {
          setFormOpen(true);
        }, 500);
      } else {
        console.log('No kid selected yet.');
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.activityTypeCard,
          isSelected && styles.activityTypeCardSelected,
        ]}
        onPress={handlePress}
      >
        <View style={styles.activityIconWrapper}>
          <Icon name={ACTIVITY_ICONS[type]} size={50} color="#6200ee" />
        </View>
        <Text style={styles.activityTypeText}>{type.toUpperCase()}</Text>

        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Icon name="check-circle" size={24} color="#6200ee" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Helper to narrow existingActivity by type
  function getInitialData<T extends NewActivity>(
    type: ActivityType
  ): T | undefined {
    if (existingActivity?.type === type) {
      return existingActivity as T;
    }
    return undefined;
  }

  // Render the selected form
  const renderForm = () => {
    if (!selectedType || !selectedKid) return null;

    const commonProps = {
      kidId: selectedKid,
      initialData: existingActivity,
      onSubmit: handleSubmit,
      onCancel: () => setFormOpen(false),
      existingActivity:
        selectedType === existingActivity?.type ? existingActivity : undefined,
    };

    switch (selectedType) {
      case ActivityType.FEEDING:
        return (
          <FeedingForm
            {...commonProps}
            initialData={getInitialData<FeedingActivity>(ActivityType.FEEDING)}
          />
        );
      case ActivityType.SLEEP:
        return (
          <SleepForm
            {...commonProps}
            initialData={getInitialData<SleepActivity>(ActivityType.SLEEP)}
          />
        );
      case ActivityType.DIAPER:
        return (
          <DiaperForm
            {...commonProps}
            initialData={getInitialData<DiaperActivity>(ActivityType.DIAPER)}
          />
        );
      case ActivityType.BATH:
        return (
          <BathForm
            {...commonProps}
            initialData={getInitialData<BathActivity>(ActivityType.BATH)}
          />
        );
      case ActivityType.MEDICATION:
        return (
          <MedicationForm
            {...commonProps}
            initialData={getInitialData<MedicationActivity>(
              ActivityType.MEDICATION
            )}
          />
        );
      case ActivityType.NOTE:
        return (
          <NoteForm
            {...commonProps}
            initialData={getInitialData<NoteActivity>(ActivityType.NOTE)}
          />
        );
      case ActivityType.MILESTONE:
        return (
          <MilestoneForm
            {...commonProps}
            initialData={getInitialData<MilestoneActivity>(
              ActivityType.MILESTONE
            )}
          />
        );
      default:
        return <Text>Unsupported activity type</Text>;
    }
  };

  if (formOpen) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setFormOpen(false)}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={28} color="#6200ee" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <ScrollView>{renderForm()}</ScrollView>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={onCancel} // passed from parent to close ActivityForm entirely
        style={styles.backButton}
      >
        <Icon name="close" size={28} color="#6200ee" />
        <Text style={styles.backButtonText}>Cancel</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.sectionTitle}>Select Kid</Text>
        <View style={styles.grid}>
          {kids.map((kid) => (
            <KidCard key={kid.id} kid={kid} />
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Select Activity Type</Text>
        <View style={styles.grid}>
          {(Object.values(ActivityType) as ActivityType[]).map((type) => (
            <ActivityTypeCard
              key={type}
              type={type}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedKid={selectedKid}
            />
          ))}
        </View>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#888' }}>
            Select a kid and activity type to proceed
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default ActivityForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  kidCard: {
    width: CARD_3_SIZE,
    height: CARD_3_SIZE + 32, // more space for name
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#bdda79ff',
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative', // allow name to be visible
  },
  kidCardSelected: {
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: '#e8def8', // light purple background to highlight
    boxShadow: '0px 2px 4px rgba(98, 0, 238, 0.5)',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },
  selectedOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    boxShadow: '0px 1px 2px rgba(98, 0, 238, 0.4)',
    // Optional: add shadow for better visibility
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  kidPhoto: {
    width: CARD_3_SIZE,
    height: CARD_3_SIZE,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  kidIconContainer: {
    width: CARD_3_SIZE,
    height: CARD_3_SIZE,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kidName: {
    marginTop: 0,
    fontWeight: '600',
    fontSize: 14,
    maxWidth: CARD_3_SIZE - 12,
    textAlign: 'center',
    flexShrink: 1,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    marginHorizontal: 6,
  },
  activityTypeCard: {
    width: CARD_5_SIZE,
    height: CARD_5_SIZE,
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#bdda79ff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  activityIconWrapper: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  activityTypeCardSelected: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  activityTypeText: {
    marginTop: 0,
    marginBottom: 2,
    fontWeight: '800',
    fontSize: 10,
    color: '#6200ee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200ee',
    marginLeft: 6,
    fontWeight: '600',
  },
});
