import { FeedingDetails } from './Feeding';
import { MedicationDetails } from './Medication';

// src/types/Activity.ts

export type ActivityType =
  | 'feeding'
  | 'sleep'
  | 'diaper'
  | 'bath'
  | 'medication'
  | 'note'
  | 'milestone';

export interface Activity {
  id: string;
  kidId: string;
  type: ActivityType;
  timestamp: number;
  duration?: number;
  createdAt: number;
  updatedAt: number;

  // specific per type
  details:
    | FeedingDetails
    | MedicationDetails
    | { wet?: boolean; dirty?: boolean } // Diaper
    | { start: number; end: number } // Sleep
    | { content: string } // Note
    | { event?: string }; // Bath
}
