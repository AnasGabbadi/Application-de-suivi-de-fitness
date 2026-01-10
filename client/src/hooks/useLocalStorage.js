import { useState, useEffect } from 'react';

/**
 * Hook pour synchroniser un état avec le localStorage
 * @param {string} key - Clé du localStorage
 * @param {*} initialValue - Valeur initiale
 * @returns {Array} [valeur, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Fonction pour récupérer la valeur initiale
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lecture localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Fonction pour définir une valeur
  const setValue = (value) => {
    try {
      // Permettre à value d'être une fonction comme useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur écriture localStorage key "${key}":`, error);
    }
  };

  // Fonction pour supprimer la valeur
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erreur suppression localStorage key "${key}":`, error);
    }
  };

  // Écouter les changements de localStorage (depuis d'autres onglets)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn('Erreur parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;