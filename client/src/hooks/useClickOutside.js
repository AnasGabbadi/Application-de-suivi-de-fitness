import { useEffect, useRef } from 'react';

/**
 * Hook pour détecter les clics en dehors d'un élément
 * Utile pour fermer les modales, dropdowns, etc.
 * @param {Function} handler - Fonction à appeler lors du clic extérieur
 * @returns {Object} Ref à attacher à l'élément
 */
const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      // Nettoyer
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

export default useClickOutside;