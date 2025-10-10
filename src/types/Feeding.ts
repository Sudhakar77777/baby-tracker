// src/types/Feeding.ts

// Define constants for FeedingMethod
export const FeedingMethod = {
  BREAST: 'breast',
  BOTTLE: 'bottle',
  SOLID: 'solid',
  EBM: 'ebm',
} as const;
export type FeedingMethod = (typeof FeedingMethod)[keyof typeof FeedingMethod];

// Define constants for MilkType
export const MilkType = {
  FORMULA: 'formula',
  BREASTMILK_DIRECT: 'breastmilk-direct',
  BREASTMILK_EXPRESSED: 'breastmilk-expressed',
  MIXED: 'mixed',
} as const;
export type MilkType = (typeof MilkType)[keyof typeof MilkType];

// Define constants for BreastSide
export const BreastSide = {
  LEFT: 'left',
  RIGHT: 'right',
  BOTH: 'both',
} as const;
export type BreastSide = (typeof BreastSide)[keyof typeof BreastSide];

// FeedingDetails interface
export interface FeedingDetails {
  method: FeedingMethod;
  milkType?: MilkType; // optional if method !== 'bottle'
  side?: BreastSide; // only for breast
  amount?: number; // in ml
  foodName?: string; // optional for solids
}
