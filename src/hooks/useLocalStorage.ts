
import { useState, useEffect } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface DBSchema {
  appData: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<DBSchema>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<DBSchema>('AppDatabase', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('appData')) {
          db.createObjectStore('appData');
        }
      },
    });
  }
  return dbPromise;
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger la valeur depuis IndexedDB au montage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const db = await getDB();
        const value = await db.get('appData', key);
        if (value !== undefined) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error(`Error reading IndexedDB key "${key}":`, error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const db = await getDB();
      await db.put('appData', valueToStore, key);
    } catch (error) {
      console.error(`Error setting IndexedDB key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isInitialized] as const;
}
