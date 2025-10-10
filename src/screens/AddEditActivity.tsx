// src/screens/AddEditActivityScreen.tsx

import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { ActivityType, NewActivity, Activity } from '../types/Activity';

import FeedingForm from '../components/activity/FeedingForm';
import SleepForm from '../components/activity/SleepForm';
import DiaperForm from '../components/activity/DiaperForm';
import BathForm from '../components/activity/BathForm';
import MedicationForm from '../components/activity/MedicationForm';
import NoteForm from '../components/activity/NoteForm';
import MilestoneForm from '../components/activity/MilestoneForm';

// ✅ Enum-safe list of activity types for selection
const activityTypes = [
  { label: 'Feeding', value: ActivityType.FEEDING },
  { label: 'Sleep', value: ActivityType.SLEEP },
  { label: 'Diaper Change', value: ActivityType.DIAPER },
  { label: 'Bath', value: ActivityType.BATH },
  { label: 'Medication', value: ActivityType.MEDICATION },
  { label: 'Note', value: ActivityType.NOTE },
  { label: 'Milestone', value: ActivityType.MILESTONE },
] as const;

// ✅ Distributed helper to omit kidId from union type
type WithoutKidId<T> = T extends any ? Omit<T, 'kidId'> : never;
type NewActivityInput = WithoutKidId<NewActivity>;

interface AddEditActivityScreenProps {
  route: {
    params?: {
      activity?: Activity;
      kidId?: string;
    };
  };
  navigation: any;
}

export default function AddEditActivityScreen({
  route,
  navigation,
}: AddEditActivityScreenProps) {
  const { activity: existingActivity, kidId: presetKidId } = route.params || {};
  const context = useContext(AppContext);

  if (!context) throw new Error('AppContext not found');

  const {
    kids,
    addNewActivity,
    updateExistingActivity,
    selectedKid,
    setSelectedKid,
  } = context;

  const [selectedType, setSelectedType] = useState<ActivityType | null>(
    existingActivity ? existingActivity.type : null
  );

  const [currentKidId, setCurrentKidId] = useState<string | null>(
    existingActivity ? existingActivity.kidId : presetKidId || null
  );

  useEffect(() => {
    if (!currentKidId && kids.length === 1) {
      setCurrentKidId(kids[0].id);
      setSelectedKid(kids[0]);
    }
  }, [kids]);

  if (!currentKidId) {
    return (
      <View style={styles.centered}>
        <Text>Please select a kid first from previous screen.</Text>
      </View>
    );
  }

  // Save handler for add/update
  async function handleSubmit(activityData: NewActivity) {
    try {
      if (existingActivity) {
        await updateExistingActivity(existingActivity.id, activityData);
      } else {
        await addNewActivity(activityData);
      }
      Alert.alert('Success', 'Activity saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save activity');
      console.error(err);
    }
  }

  // ✅ Wrap form submit to attach `kidId`
  function submitWithKidId<T extends NewActivityInput>(dataWithoutKidId: T) {
    if (!currentKidId) throw new Error('No kid selected');

    const fullActivity: NewActivity = {
      ...dataWithoutKidId,
      kidId: currentKidId,
    } as NewActivity;

    handleSubmit(fullActivity);
  }

  // Render activity form based on selected type
  function renderForm() {
    switch (selectedType) {
      case ActivityType.FEEDING:
        if (existingActivity?.type !== ActivityType.FEEDING) {
          return null; // or fallback UI
        }
        return (
          <FeedingForm
            onSubmit={submitWithKidId}
            initialData={existingActivity}
          />
        );

      case ActivityType.SLEEP:
        if (existingActivity?.type !== ActivityType.SLEEP) {
          return null;
        }
        return (
          <SleepForm
            onSubmit={submitWithKidId}
            initialData={existingActivity}
          />
        );

      case ActivityType.DIAPER:
        if (existingActivity?.type !== ActivityType.DIAPER) {
          return null;
        }
        return (
          <DiaperForm
            onSubmit={submitWithKidId}
            initialData={existingActivity}
          />
        );

      case ActivityType.BATH:
        if (existingActivity?.type !== ActivityType.BATH) {
          return null;
        }
        return (
          <BathForm onSubmit={submitWithKidId} initialData={existingActivity} />
        );

      case ActivityType.MEDICATION:
        if (existingActivity?.type !== ActivityType.MEDICATION) {
          return null;
        }
        return (
          <MedicationForm
            onSubmit={submitWithKidId}
            initialData={existingActivity}
          />
        );

      case ActivityType.NOTE:
        if (existingActivity?.type !== ActivityType.NOTE) {
          return null;
        }
        return (
          <NoteForm onSubmit={submitWithKidId} initialData={existingActivity} />
        );

      case ActivityType.MILESTONE:
        if (existingActivity?.type !== ActivityType.MILESTONE) {
          return null;
        }
        return (
          <MilestoneForm
            onSubmit={submitWithKidId}
            initialData={existingActivity}
          />
        );

      default:
        return (
          <View>
            <Text style={styles.header}>Select Activity Type</Text>
            {activityTypes.map(({ label, value }) => (
              <Button
                key={value}
                mode="outlined"
                onPress={() => setSelectedType(value)}
                style={styles.typeButton}
              >
                {label}
              </Button>
            ))}
          </View>
        );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderForm()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  typeButton: { marginBottom: 12 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
});
