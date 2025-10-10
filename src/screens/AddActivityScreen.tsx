// AddActivityScreen.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ActivityType, Activity } from '../types/Activity';
import { AppContext } from '../context/AppContext';
import FeedingForm from '../components/activity/FeedingForm';
import SleepForm from '../components/activity/SleepForm';
import DiaperForm from '../components/activity/DiaperForm';
import BathForm from '../components/activity/BathForm';
import MedicationForm from '../components/activity/MedicationForm';
import NoteForm from '../components/activity/NoteForm';
import MilestoneForm from '../components/activity/MilestoneForm';
import { addActivity } from '../storage/activities';

const activityTypes: { label: string; value: ActivityType }[] = [
  { label: 'Feeding', value: 'feeding' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Diaper Change', value: 'diaper' },
  { label: 'Bath', value: 'bath' },
  { label: 'Medication', value: 'medication' },
  { label: 'Note', value: 'note' },
  { label: 'Milestone', value: 'milestone' },
];

export default function AddActivityScreen({ navigation }: any) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      'AppContext not found. Make sure your component is wrapped in AppProvider.'
    );
  }
  const { selectedKid, setSelectedKid, kids } = context;

  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [kidSelectionNeeded, setKidSelectionNeeded] = useState(false);

  // Auto-select kid if only one kid exists
  useEffect(() => {
    if (!selectedKid) {
      if (kids.length === 1) {
        setSelectedKid(kids[0]);
        setKidSelectionNeeded(false);
      } else if (kids.length === 0) {
        setKidSelectionNeeded(false); // No kids at all, user must add first
      } else {
        setKidSelectionNeeded(true); // More than one kid, user must pick
      }
    }
  }, [kids, selectedKid, setSelectedKid]);

  // Callback after form submit
  async function handleAddActivity(
    activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'kidId'>
  ) {
    if (!selectedKid) {
      Alert.alert('No kid selected', 'Please select a kid first.');
      return;
    }

    try {
      const newActivity = await addActivity({
        ...activityData,
        kidId: selectedKid.id,
        timestamp: activityData.timestamp || Date.now(),
      });

      if (newActivity) {
        Alert.alert('Success', 'Activity added successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to add activity');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred');
      console.error('AddActivity error:', err);
    }
  }

  function renderForm() {
    switch (selectedType) {
      case 'feeding':
        return <FeedingForm onSubmit={handleAddActivity} />;
      case 'sleep':
        return <SleepForm onSubmit={handleAddActivity} />;
      case 'diaper':
        return <DiaperForm onSubmit={handleAddActivity} />;
      case 'bath':
        return <BathForm onSubmit={handleAddActivity} />;
      case 'medication':
        return <MedicationForm onSubmit={handleAddActivity} />;
      case 'note':
        return <NoteForm onSubmit={handleAddActivity} />;
      case 'milestone':
        return <MilestoneForm onSubmit={handleAddActivity} />;
      default:
        return null;
    }
  }

  // Render kid picker if multiple kids and no selected kid
  if (kidSelectionNeeded) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Select Kid</Text>
        {kids.map((kid) => (
          <Button
            key={kid.id}
            mode="outlined"
            onPress={() => {
              setSelectedKid(kid);
              setKidSelectionNeeded(false);
            }}
            style={styles.typeButton}
          >
            {kid.name}
          </Button>
        ))}
      </ScrollView>
    );
  }

  // No kids at all?
  if (kids.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Please add a kid first from Manage Kids screen.</Text>
      </View>
    );
  }

  // If kid is selected, show activity type or form
  if (!selectedKid) {
    // This state should rarely happen, fallback
    return (
      <View style={styles.centered}>
        <Text>Please select a kid first.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!selectedType && (
        <>
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
        </>
      )}

      {selectedType && (
        <>
          <Button
            onPress={() => setSelectedType(null)}
            style={styles.backButton}
          >
            ← Back to Types
          </Button>
          {renderForm()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  typeButton: {
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
