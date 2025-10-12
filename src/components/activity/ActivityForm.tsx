import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

import SelectableKidCard from './SelectableKidCard';
import SelectableActivityCard from './SelectableActivityCard';

interface Props {
  existingActivity?: NewActivity;
  onSubmit: (activity: NewActivity) => void;
  onCancel: () => void;
}

const ActivityForm: React.FC<Props> = ({
  existingActivity,
  onSubmit,
  onCancel,
}) => {
  const { kids, lastSelectedKid } = useContext(AppContext)!;

  const [selectedKid, setSelectedKid] = useState<string | null>(
    existingActivity?.kidId || lastSelectedKid?.id || null
  );
  const [selectedType, setSelectedType] = useState<ActivityType | null>(
    existingActivity?.type || null
  );
  const [formOpen, setFormOpen] = useState<boolean>(!!existingActivity);

  useEffect(() => {
    if (!selectedKid && kids.length > 0) {
      const defaultKidId =
        existingActivity?.kidId || lastSelectedKid?.id || kids[0]?.id;
      setSelectedKid(defaultKidId);
    }
  }, [kids]);

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

  function getInitialData<T extends NewActivity>(
    type: ActivityType
  ): T | undefined {
    if (existingActivity?.type === type) {
      return existingActivity as T;
    }
    return undefined;
  }

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
      <TouchableOpacity onPress={onCancel} style={styles.backButton}>
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
            <SelectableKidCard
              key={kid.id}
              kid={kid}
              isSelected={selectedKid === kid.id}
              onSelect={(kidId) => {
                setSelectedKid(kidId);
                if (selectedType) setFormOpen(true);
              }}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Select Activity Type</Text>
        <View style={styles.grid}>
          {(Object.values(ActivityType) as ActivityType[]).map((type) => (
            <SelectableActivityCard
              key={type}
              type={type}
              isSelected={selectedType === type}
              disabled={!selectedKid}
              onSelect={(type) => {
                setSelectedType(type);
                if (selectedKid) setTimeout(() => setFormOpen(true), 300);
              }}
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
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    marginHorizontal: 6,
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
