// src/types/Medication.ts
import { BabyStage } from './Stage';

export interface MedicationDetails {
  name: string;
  dose: string;
  unit?: 'ml' | 'drops' | 'tablet';
  reason?: string;
}

export const defaultMedicationsByStage: Record<BabyStage, MedicationDetails[]> =
  {
    newborn: [
      { name: 'Vitamin D', dose: '400 IU' },
      { name: 'Iron', dose: 'as prescribed' },
    ],
    infant: [{ name: 'Vitamin D', dose: '400 IU' }],
    toddler: [],
  };
