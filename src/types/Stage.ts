// src/types/Stage.ts

// Define constants for BabyStage
export const BabyStage = {
  NEWBORN: 'newborn', // 0–2 months
  INFANT: 'infant', // 2–12 months
  TODDLER: 'toddler', // 1–3 years
} as const;

// Export type from values
export type BabyStage = (typeof BabyStage)[keyof typeof BabyStage];

// Function to get stage from DOB
export function getStageFromDOB(birthdate: string): BabyStage {
  const ageInMonths =
    (Date.now() - new Date(birthdate).getTime()) /
    (1000 * 60 * 60 * 24 * 30.44); // Approximate month

  if (ageInMonths < 2) return BabyStage.NEWBORN;
  if (ageInMonths < 12) return BabyStage.INFANT;
  return BabyStage.TODDLER;
}
