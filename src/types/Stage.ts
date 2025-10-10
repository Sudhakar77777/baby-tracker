// src/types/Stage.ts

export type BabyStage =
  | 'newborn' // 0–2 months
  | 'infant' // 2–12 months
  | 'toddler'; // 1–3 years

export function getStageFromDOB(birthdate: string): BabyStage {
  const ageInMonths =
    (Date.now() - new Date(birthdate).getTime()) /
    (1000 * 60 * 60 * 24 * 30.44);

  if (ageInMonths < 2) return 'newborn';
  if (ageInMonths < 12) return 'infant';
  return 'toddler';
}
