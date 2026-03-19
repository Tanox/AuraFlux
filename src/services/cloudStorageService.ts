// src/services/cloudStorageService.ts | Version: v1.0.0
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { VisualizerSettings } from '@/src/types';

export const saveSettingsToCloud = async (uid: string, settings: VisualizerSettings) => {
  try {
    const settingsRef = doc(db, 'userSettings', uid);
    await setDoc(settingsRef, {
      settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving settings to cloud:", error);
    throw error;
  }
};

export const loadSettingsFromCloud = async (uid: string): Promise<VisualizerSettings | null> => {
  try {
    const settingsRef = doc(db, 'userSettings', uid);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return settingsSnap.data().settings as VisualizerSettings;
    }
    return null;
  } catch (error) {
    console.error("Error loading settings from cloud:", error);
    throw error;
  }
};

export const getLastSyncTime = async (uid: string): Promise<Date | null> => {
  try {
    const settingsRef = doc(db, 'userSettings', uid);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists() && settingsSnap.data().updatedAt) {
      return settingsSnap.data().updatedAt.toDate();
    }
    return null;
  } catch (error) {
    console.error("Error getting last sync time:", error);
    return null;
  }
};
