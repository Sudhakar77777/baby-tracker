// src/storage/activities.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Activity,
  FeedingActivity,
  MedicationActivity,
  DiaperActivity,
  SleepActivity,
  BathActivity,
  NoteActivity,
  MilestoneActivity,
  OmitMeta,
  NewActivity,
  ActivityType, // ✅ New import
} from '../types/Activity';

const ACTIVITY_KEY = 'activity_list';

// Utility: Safely parse JSON string to Activity[]
function safeParse(json: string | null): Activity[] {
  try {
    const data = JSON.parse(json || '[]');
    if (Array.isArray(data)) {
      return data;
    }
    console.warn('Unexpected activity data format, resetting storage.');
    return [];
  } catch (err) {
    console.error('Failed to parse activities JSON:', err);
    return [];
  }
}

// Get all activities from storage
export async function getAllActivities(): Promise<Activity[]> {
  let rawData: string | null = null;
  try {
    rawData = await AsyncStorage.getItem(ACTIVITY_KEY);
    return safeParse(rawData);
  } catch (err) {
    console.error('[getAllActivities] Error:', err);
    return [];
  } finally {
    if (__DEV__) {
      console.log('[getAllActivities] Fetched', rawData?.length || 0, 'chars');
    }
  }
}

// Add a new activity to storage
export async function addActivity(
  activity: NewActivity
): Promise<Activity | null> {
  try {
    const timestamp = Date.now();
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const existing = await getAllActivities();
    const updated = [...existing, newActivity];

    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
    if (__DEV__) {
      console.log('[addActivity] Added activity with id:', newActivity.id);
    }
    return newActivity;
  } catch (err) {
    console.error('[addActivity] Failed to add activity:', err);
    return null;
  }
}

// Update existing activity by id
export async function updateActivity<T extends Activity>(
  id: string,
  activity: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<T | null> {
  try {
    const existing = await getAllActivities();
    const index = existing.findIndex((a) => a.id === id);

    if (index === -1) {
      console.warn('[updateActivity] Activity not found:', id);
      return null;
    }

    const oldActivity = existing[index] as T;

    // ✅ Runtime type check remains valid
    if (activity.type && activity.type !== oldActivity.type) {
      console.warn('[updateActivity] Cannot change activity type');
      return null;
    }

    const updatedActivity: T = {
      ...oldActivity,
      ...activity,
      id,
      updatedAt: Date.now(),
    };

    const updated = [...existing];
    updated[index] = updatedActivity;

    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));

    if (__DEV__) {
      console.log('[updateActivity] Updated activity', id);
    }

    return updatedActivity;
  } catch (err) {
    console.error('[updateActivity] Failed to update activity:', err);
    return null;
  }
}

// Get all activities for a specific kid by kidId
export async function getActivitiesForKid(kidId: string): Promise<Activity[]> {
  try {
    const all = await getAllActivities();
    return all.filter((activity) => activity.kidId === kidId);
  } catch (err) {
    console.error('[getActivitiesForKid] Error:', err);
    return [];
  }
}

// Delete activity by id
export async function deleteActivity(id: string): Promise<boolean> {
  console.log('Deleting activity with id:', id);
  try {
    const existing = await getAllActivities();
    const filtered = existing.filter((a) => a.id !== id);
    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(filtered));
    if (__DEV__) {
      console.log('[deleteActivity] Deleted activity with id:', id);
    }
    return true;
  } catch (err) {
    console.error('[deleteActivity] Failed:', err);
    return false;
  }
}

// Clear all activities (for dev/testing only)
export async function clearAllActivities(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACTIVITY_KEY);
    if (__DEV__) {
      console.log('[clearAllActivities] All activities cleared');
    }
  } catch (err) {
    console.error('[clearAllActivities] Error:', err);
  }
}
