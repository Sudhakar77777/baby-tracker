// src/types/Activity.ts

import { FeedingDetails } from './Feeding';
import { MedicationDetails } from './Medication';

//
// Define constants for ActivityType
//
export const ActivityType = {
  FEEDING: 'feeding',
  SLEEP: 'sleep',
  DIAPER: 'diaper',
  BATH: 'bath',
  MEDICATION: 'medication',
  NOTE: 'note',
  MILESTONE: 'milestone',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

//
// Shared base activity structure
//
export interface BaseActivity {
  id: string;
  kidId: string;
  type: ActivityType;
  timestamp: number; // when it happened
  createdAt: number;
  updatedAt: number;
}

//
// Per-activity detail typing via discriminated unions
//
export interface FeedingActivity extends BaseActivity {
  type: typeof ActivityType.FEEDING;
  details: FeedingDetails;
}

export interface MedicationActivity extends BaseActivity {
  type: typeof ActivityType.MEDICATION;
  details: MedicationDetails;
}

export interface DiaperActivity extends BaseActivity {
  type: typeof ActivityType.DIAPER;
  details: {
    wet?: boolean;
    dirty?: boolean;
    notes?: string;
  };
}

export interface SleepActivity extends BaseActivity {
  type: typeof ActivityType.SLEEP;
  details: {
    start: number;
    end: number;
    duration: number; // in minutes
  };
}

export interface BathActivity extends BaseActivity {
  type: typeof ActivityType.BATH;
  details: {
    content?: string; // optional free-text
  };
}

export interface NoteActivity extends BaseActivity {
  type: typeof ActivityType.NOTE;
  details: {
    content: string;
  };
}

export interface MilestoneActivity extends BaseActivity {
  type: typeof ActivityType.MILESTONE;
  details: {
    event?: string; // milestone description
  };
}

//
// Union of all activities
//
export type Activity =
  | FeedingActivity
  | MedicationActivity
  | DiaperActivity
  | SleepActivity
  | BathActivity
  | NoteActivity
  | MilestoneActivity;

//
// Helper type: Omit metadata fields from BaseActivity dynamically
//
export type OmitMeta<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

//
// NewActivity: input type for adding new activities (discriminated union)
//
export type NewActivity =
  | OmitMeta<FeedingActivity>
  | OmitMeta<MedicationActivity>
  | OmitMeta<DiaperActivity>
  | OmitMeta<SleepActivity>
  | OmitMeta<BathActivity>
  | OmitMeta<NoteActivity>
  | OmitMeta<MilestoneActivity>;
