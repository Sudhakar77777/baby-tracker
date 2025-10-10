// src/types/Kid.ts

export const Gender = {
  BOY: 'boy',
  GIRL: 'girl',
  OTHER: 'other',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Kid {
  id: string;
  name: string;
  birthdate: string; // ISO string (e.g., "2022-06-15")
  gender: Gender;
  photoUri?: string; // optional
}
