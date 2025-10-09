export interface Kid {
  id: string;
  name: string;
  birthdate: string; // ISO string (e.g., "2022-06-15")
  gender: 'boy' | 'girl' | 'other';
  photoUri?: string; // optional
}
