declare module 'expo-sqlite' {
    export interface SQLTransaction {
      executeSql: (
        sqlStatement: string,
        args?: any[],
        successCallback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
        errorCallback?: (transaction: SQLTransaction, error: SQLError) => boolean
      ) => void;
    }
  
    export interface SQLResultSet {
      insertId?: number;
      rowsAffected: number;
      rows: {
        length: number;
        item: (index: number) => any;
        _array: any[];
      };
    }
  
    export interface SQLError {
      code: number;
      message: string;
    }
  
    export interface WebSQLDatabase {
      transaction: (
        callback: (transaction: SQLTransaction) => void,
        errorCallback?: (error: SQLError) => void,
        successCallback?: () => void
      ) => void;
    }
  
    export function openDatabase(
      name: string,
      version?: string,
      description?: string,
      size?: number
    ): WebSQLDatabase;
  }
  