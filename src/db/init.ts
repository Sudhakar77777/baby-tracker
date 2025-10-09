import { createKidsTable } from './kids';

export function initDB(): void {
  createKidsTable();
  // Add more tables later like: createActivitiesTable()
}
