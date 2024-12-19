import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test.db');

export default function App() {
  useEffect(() => {
    try {
      // Initialize the database
      db.transaction(
        (tx) => {
          // Create the "test" table if it doesn't exist
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS test (
              id INTEGER PRIMARY KEY NOT NULL,
              name TEXT NOT NULL
            );`,
            [],
            () => console.log('Table created successfully'),
            (_, error) => {
              console.error('Error creating table:', error);
              return false;
            }
          );

          // Insert sample data into the table (optional, for testing)
          tx.executeSql(
            `INSERT INTO test (name) VALUES (?);`,
            ['Sample Name'],
            (_, result) => {
              console.log('Sample data inserted:', result);
            },
            (_, error) => {
              console.error('Error inserting sample data:', error);
              return false;
            }
          );
        },
        (error) => console.error('Transaction error:', error),
        () => console.log('Database initialized successfully')
      );

      // Query data from the "test" table
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM test;`,
            [],
            (_, result) => {
              console.log('Query results:', result.rows._array);
            },
            (_, error) => {
              console.error('Error querying data:', error);
              return false;
            }
          );
        },
        (error) => console.error('Transaction error querying data:', error),
        () => console.log('Query completed successfully')
      );
    } catch (error) {
      console.error('SQLite error:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SQLite Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
