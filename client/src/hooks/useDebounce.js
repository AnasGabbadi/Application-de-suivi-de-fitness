import { useState, useEffect } from 'react';

/**
 * Hook pour debouncer une valeur
 * Utile pour les recherches en temps réel
 * @param {*} value - Valeur à debouncer
 * @param {number} delay - Délai en millisecondes (défaut: 500ms)
 * @returns {*} Valeur debouncée
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si la valeur change avant le délai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;