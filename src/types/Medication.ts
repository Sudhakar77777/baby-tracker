// src/types/Medication.ts

import { BabyStage } from './Stage';

// 1. Define constants for MedicationUnit
export const MedicationUnit = {
  ML: 'ml',
  DROPS: 'drops',
  TABLET: 'tablet',
} as const;

export type MedicationUnit =
  (typeof MedicationUnit)[keyof typeof MedicationUnit];

// 2. Define interface for MedicationDetails
export interface MedicationDetails {
  name: string;
  dose: string;
  unit?: MedicationUnit;
  reason?: string;
}

// 3. Define default medications per stage
export const defaultMedicationsByStage: Record<BabyStage, MedicationDetails[]> =
  {
    [BabyStage.NEWBORN]: [
      { name: 'Vitamin D', dose: '400 IU' },
      { name: 'Iron', dose: 'as prescribed' },
    ],
    [BabyStage.INFANT]: [{ name: 'Vitamin D', dose: '400 IU' }],
    [BabyStage.TODDLER]: [],
  };
