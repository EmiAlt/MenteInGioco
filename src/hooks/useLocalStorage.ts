import { useState, useEffect } from "react";

/**
 * Hook personalizzato per gestire stato con persistenza in localStorage
 * 
 * @param key - Chiave localStorage
 * @param initialValue - Valore iniziale se non esiste in localStorage
 * @returns [valore, setter] simile a useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Stato inizializzato con valore da localStorage o initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[LocalStorage] Errore nel leggere la chiave "${key}":`, error);
      return initialValue;
    }
  });

  // Setter che aggiorna sia lo stato che localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`[LocalStorage] Errore nel salvare la chiave "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
