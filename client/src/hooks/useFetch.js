import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook personnalisé pour gérer les appels API
 * @param {Function} fetchFunction - Fonction asynchrone qui retourne une promesse
 * @param {Array} dependencies - Dépendances pour re-déclencher le fetch
 * @param {Object} options - Options supplémentaires
 * @returns {Object} État du fetch (data, loading, error, refetch)
 */
const useFetch = (fetchFunction, dependencies = [], options = {}) => {
  const {
    immediate = true, // Exécuter immédiatement au montage
    onSuccess = null, // Callback de succès
    onError = null,   // Callback d'erreur
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // Fonction pour exécuter le fetch
  const executeFetch = useCallback(async () => {
    try {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau controller pour cette requête
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const result = await fetchFunction(abortControllerRef.current.signal);

      if (isMountedRef.current) {
        setData(result);
        setLoading(false);
        
        // Callback de succès
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (err) {
      // Ignorer les erreurs d'annulation
      if (err.name === 'AbortError') {
        return;
      }

      if (isMountedRef.current) {
        const errorMessage = err.message || 'Une erreur est survenue';
        setError(errorMessage);
        setLoading(false);

        // Callback d'erreur
        if (onError) {
          onError(err);
        }
      }
    }
  }, [fetchFunction, onSuccess, onError]);

  // Effet pour exécuter le fetch
  useEffect(() => {
    if (immediate) {
      executeFetch();
    }

    // Cleanup : annuler la requête et marquer comme démonté
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  // Fonction pour refetch manuellement
  const refetch = useCallback(() => {
    return executeFetch();
  }, [executeFetch]);

  // Fonction pour réinitialiser l'état
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
};

export default useFetch;