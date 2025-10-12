import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Kid } from '../types/Kid';
import { Activity } from '../types/Activity';
import { getAllKids, addKid, updateKid, deleteKid } from '../storage/kids';
import {
  getAllActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  setLastSelectedKidId,
  getLastSelectedKidId,
} from '../storage/activities';
import { NewActivity } from '../types/Activity';

interface AppContextType {
  kids: Kid[];
  activities: Activity[];
  lastSelectedKid: Kid | null;
  setLastSelectedKid: (kid: Kid | null) => void;

  reloadKids: () => Promise<void>;
  addNewKid: (kid: Omit<Kid, 'id'>) => Promise<void>;
  updateExistingKid: (id: string, kid: Omit<Kid, 'id'>) => Promise<void>;
  deleteExistingKid: (id: string) => Promise<void>;

  reloadActivities: () => Promise<void>;
  addNewActivity: (activity: NewActivity) => Promise<void>;
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
  const [lastSelectedKid, setLastSelectedKid] = useState<Kid | null>(null);

  const resolveLastSelectedKid = async (kids: Kid[]): Promise<Kid | null> => {
    const lastKidId = await getLastSelectedKidId();

    if (kids.length === 0) return null;

    const matchedKid = kids.find((k) => k.id === lastKidId);
    if (matchedKid) return matchedKid;

    if (kids.length === 1) return kids[0];

    return null;
  };

  // --- Kids handlers ---
  const reloadKids = async () => {
    try {
      const data = await getAllKids();
      setKids(data);
      const resolvedKid = await resolveLastSelectedKid(data);
      setLastSelectedKid(resolvedKid);
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
  };

  // --- Activities handlers ---
  const reloadActivities = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
      // Resolve last selected kid using the same logic as reloadKids
      const resolvedKid = await resolveLastSelectedKid(kids);
      setLastSelectedKid(resolvedKid);
    } catch (error) {
      console.error('Failed to load activities in context', error);
    }
  };

  const addNewActivity = async (activity: NewActivity) => {
    try {
      const added = await addActivity(activity);
      if (!added) {
        console.warn('[AppContext] Failed to add new activity');
      } else {
        await setLastSelectedKidId(activity.kidId);
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
    console.log('Deleting activity with id:', id);
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
    const loadData = async () => {
      await reloadKids();
      await reloadActivities();
    };
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        kids,
        activities,
        lastSelectedKid,
        setLastSelectedKid,
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
