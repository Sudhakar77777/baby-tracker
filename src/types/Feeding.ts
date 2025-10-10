// src/types/Feeding.ts

export type FeedingMethod = 'breast' | 'bottle' | 'solid' | 'ebm';

export type MilkType =
  | 'formula'
  | 'breastmilk-direct'
  | 'breastmilk-expressed'
  | 'mixed';

export interface FeedingDetails {
  method: FeedingMethod;
  milkType?: MilkType; // optional if method !== 'bottle'
  side?: 'left' | 'right' | 'both'; // only for breast
  amount?: number; // in ml
  foodName?: string; // optional for solids
}
