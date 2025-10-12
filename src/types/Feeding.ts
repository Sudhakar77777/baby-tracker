// src/types/Feeding.ts

// Define constants for FeedingMethod
export const FeedingMethod = {
  BREAST: 'breast',
  INFANTCUP: 'infant-cup', // paladai
  BOTTLE: 'bottle',
  SOLID: 'solid',
} as const;
export type FeedingMethod = (typeof FeedingMethod)[keyof typeof FeedingMethod];

// Define constants for MilkType
export const MilkType = {
  BREASTMILK_DIRECT: 'direct',
  BREASTMILK_EXPRESSED: 'expressed',
  FORMULA: 'formula',
  MIXED: 'mixed',
  NA: 'n/a',
} as const;
export type MilkType = (typeof MilkType)[keyof typeof MilkType];

// Define constants for BreastSide
export const BreastSide = {
  LEFT: 'left',
  RIGHT: 'right',
  BOTH: 'both',
  NA: 'n/a',
} as const;
export type BreastSide = (typeof BreastSide)[keyof typeof BreastSide];

// FeedingDetails interface
export interface FeedingDetails {
  method: FeedingMethod;
  milkType?: MilkType; // optional if method !== 'bottle'
  side?: BreastSide; // only for breast
  amount?: number; // in ml
  duration?: number; // in minutes only for breast
  foodName?: string; // optional for solids
  solidQuantity?: string; // e.g., "2 tbsp", optional for solids
  solidNotes?: string; // optional for solids
}
