import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Kid } from '../types/Kid';
import { Activity } from '../types/Activity';
import { getAllKids, addKid, updateKid, deleteKid } from '../storage/kids';
import {
  getAllActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  NewActivity,
} from '../storage/activities';

interface AppContextType {
  kids: Kid[];
  activities: Activity[];
  selectedKid: Kid | null;
  setSelectedKid: (kid: Kid | null) => void;

  reloadKids: () => Promise<void>;
  addNewKid: (kid: Omit<Kid, 'id'>) => Promise<void>;
  updateExistingKid: (id: string, kid: Omit<Kid, 'id'>) => Promise<void>;
  deleteExistingKid: (id: string) => Promise<void>;

  reloadActivities: () => Promise<void>;
  addNewActivity: (
    activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateExistingActivity: (
    id: string,
    activity: Partial<Activity>
  ) => Promise<void>;
  deleteExistingActivity: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [kids, setKids] = useState<Kid[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  // --- Kids handlers ---
  const reloadKids = async () => {
    try {
      const data = await getAllKids();
      setKids(data);
      if (selectedKid && !data.find((k) => k.id === selectedKid.id)) {
        setSelectedKid(null);
      }
    } catch (error) {
      console.error('Failed to load kids in context', error);
    }
  };

  const addNewKid = async (kid: Omit<Kid, 'id'>) => {
    await addKid(kid.name, kid.birthdate, kid.gender, kid.photoUri);
    await reloadKids();
  };

  const updateExistingKid = async (id: string, kid: Omit<Kid, 'id'>) => {
    await updateKid(id, kid.name, kid.birthdate, kid.gender, kid.photoUri);
    await reloadKids();
  };

  const deleteExistingKid = async (id: string) => {
    await deleteKid(id);
    await reloadKids();
    if (selectedKid?.id === id) {
      setSelectedKid(null);
    }
  };

  // --- Activities handlers ---
  const reloadActivities = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities in context', error);
    }
  };

  const addNewActivity = async (activity: NewActivity) => {
    try {
      const added = await addActivity(activity);
      if (!added) {
        console.warn('[AppContext] Failed to add new activity');
      }
    } catch (error) {
      console.error('[AppContext] Error adding new activity:', error);
    } finally {
      await reloadActivities();
    }
  };

  const updateExistingActivity = async (
    id: string,
    activity: Partial<Activity>
  ) => {
    try {
      const updated = await updateActivity(id, activity);
      if (!updated) {
        console.warn(`[AppContext] Failed to update activity with id ${id}`);
      }
    } catch (error) {
      console.error(
        `[AppContext] Error updating activity with id ${id}:`,
        error
      );
    } finally {
      await reloadActivities();
    }
  };

  const deleteExistingActivity = async (id: string) => {
    try {
      const success = await deleteActivity(id);
      if (!success) {
        console.warn(`[AppContext] Failed to delete activity with id ${id}`);
      }
    } catch (error) {
      console.error(
        `[AppContext] Error deleting activity with id ${id}:`,
        error
      );
    } finally {
      await reloadActivities();
    }
  };

  // Load data initially
  useEffect(() => {
    reloadKids();
    reloadActivities();
  }, []);

  return (
    <AppContext.Provider
      value={{
        kids,
        activities,
        selectedKid,
        setSelectedKid,
        reloadKids,
        addNewKid,
        updateExistingKid,
        deleteExistingKid,
        reloadActivities,
        addNewActivity,
        updateExistingActivity,
        deleteExistingActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
