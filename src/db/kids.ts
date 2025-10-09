import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { Kid } from '../types/Kid';

export function createKidsTable(): void {
  (db as any).transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS kids (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        birthdate TEXT NOT NULL
      );`
    );
  });
}

export function addKid(name: string, birthdate: string): Promise<Kid> {
  const newKid: Kid = {
    id: uuidv4(),
    name,
    birthdate,
  };

  return new Promise((resolve, reject) => {
    (db as any).transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO kids (id, name, birthdate) VALUES (?, ?, ?);',
        [newKid.id, newKid.name, newKid.birthdate],
        () => resolve(newKid),
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getAllKids(): Promise<Kid[]> {
  return new Promise((resolve, reject) => {
    (db as any).transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM kids;',
        [],
        (_: any, resultSet: any) => {
          const kids: Kid[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            kids.push(resultSet.rows.item(i));
          }
          resolve(kids);
        },
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function updateKid(id: string, name: string, birthdate: string): Promise<void> {
  return new Promise((resolve, reject) => {
    (db as any).transaction((tx: any) => {
      tx.executeSql(
        'UPDATE kids SET name = ?, birthdate = ? WHERE id = ?;',
        [name, birthdate, id],
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function deleteKid(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    (db as any).transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM kids WHERE id = ?;',
        [id],
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
