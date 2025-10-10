// src/storage/activities.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '../types/Activity';

const ACTIVITY_KEY = 'activity_list';

// Utility: Safely parse JSON
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

// Get all activities
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

// Add new activity
export async function addActivity(
  activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
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
    return newActivity;
  } catch (err) {
    console.error('[addActivity] Failed to add activity:', err);
    return null;
  }
}

// Update existing activity
export async function updateActivity(
  id: string,
  activity: Partial<Activity>
): Promise<Activity | null> {
  try {
    const existing = await getAllActivities();
    const index = existing.findIndex((a) => a.id === id);

    if (index === -1) {
      console.warn('[updateActivity] Activity not found:', id);
      return null;
    }

    const updatedActivity: Activity = {
      ...existing[index],
      ...activity,
      id,
      updatedAt: Date.now(),
    };

    const updated = [...existing];
    updated[index] = updatedActivity;

    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));

    return updatedActivity;
  } catch (err) {
    console.error('[updateActivity] Failed to update activity:', err);
    return null;
  }
}

// Get all activities for a kid
export async function getActivitiesForKid(kidId: string): Promise<Activity[]> {
  try {
    const all = await getAllActivities();
    return all.filter((activity) => activity.kidId === kidId);
  } catch (err) {
    console.error('[getActivitiesForKid] Error:', err);
    return [];
  }
}

// Optional: Delete activity by ID
export async function deleteActivity(id: string): Promise<boolean> {
  try {
    const existing = await getAllActivities();
    const filtered = existing.filter((a) => a.id !== id);
    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('[deleteActivity] Failed:', err);
    return false;
  }
}

// Optional: Clear all (for dev/testing only)
export async function clearAllActivities(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACTIVITY_KEY);
    console.log('[clearAllActivities] All activities cleared');
  } catch (err) {
    console.error('[clearAllActivities] Error:', err);
  }
}
