import { useState, useEffect } from 'react';
import { getStoredItem, setStoredItem } from '../services/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getStoredItem(key, initialValue);
  });

  useEffect(() => {
    setStoredItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
