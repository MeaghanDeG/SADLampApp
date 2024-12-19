import * as SQLite from 'expo-sqlite';
import { SQLTransaction, SQLResultSet, SQLError, WebSQLDatabase } from 'expo-sqlite';

// Open the database
const db: WebSQLDatabase = SQLite.openDatabase('schedules.db');

// Initialize the database
export const initDB = (): void => {
  db.transaction(
    (tx: SQLite.SQLTransaction) => {

      
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY NOT NULL,
          date TEXT NOT NULL,
          description TEXT NOT NULL,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL
        );`
      );

      // Create user responses table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_responses (
          id INTEGER PRIMARY KEY NOT NULL,
          date TEXT NOT NULL,
          response TEXT NOT NULL
        );`
      );
    },
    (error: SQLError) => {
      console.error('Error initializing database:', error);
    },
    () => {
      console.log('Database initialized successfully');
    }
  );
};

// Save a schedule
export const saveSchedule = (
  date: string,
  description: string,
  startTime: string,
  endTime: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `INSERT INTO schedules (date, description, startTime, endTime) VALUES (?, ?, ?, ?);`,
          [date, description, startTime, endTime],
          () => resolve(),
          (_: SQLTransaction, error: SQLError) => {
            console.error('Error saving schedule:', error);
            reject(error);
            return false;
          }
        );
      },
      (error: SQLError) => {
        console.error('Transaction error saving schedule:', error);
        reject(error);
      }
    );
  });
};

// Fetch schedules for a specific date
export const fetchSchedules = (date: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT * FROM schedules WHERE date = ?;`,
          [date],
          (_: SQLTransaction, result: SQLResultSet) => {
            resolve(result.rows._array);
          },
          (_: SQLTransaction, error: SQLError) => {
            console.error('Error fetching schedules:', error);
            reject(error);
            return false;
          }
        );
      },
      (error: SQLError) => {
        console.error('Transaction error fetching schedules:', error);
        reject(error);
      }
    );
  });
};
