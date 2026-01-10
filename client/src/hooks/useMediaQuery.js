import { useState, useEffect } from 'react';

/**
 * Hook pour détecter les media queries
 * Utile pour le responsive design
 * @param {string} query - Media query CSS (ex: '(min-width: 768px)')
 * @returns {boolean} True si la media query correspond
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Définir la valeur initiale
    setMatches(mediaQuery.matches);

    // Créer l'écouteur d'événement
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Ajouter l'écouteur
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      // Nettoyer
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;