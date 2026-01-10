import { createContext, useState, useEffect, useContext } from 'react';
import exerciseService from '../services/exerciseService';
import { AuthContext } from './AuthContext';

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  /**
   * Charger les exercices
   */
  const loadExercises = async (newFilters = {}) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await exerciseService.getExercises(newFilters);
      setExercises(data);
      setFilters(newFilters);
    } catch (err) {
      console.error('❌ Erreur chargement exercices:', err);
      setError(err.message || 'Erreur lors du chargement des exercices');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Créer un exercice
   */
  const createExercise = async (exerciseData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newExercise = await exerciseService.createExercise(exerciseData);
      
      // Ajouter à la liste locale
      setExercises(prev => [newExercise, ...prev]);
      
      return newExercise;
    } catch (err) {
      console.error('❌ Erreur création exercice:', err);
      setError(err.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mettre à jour un exercice
   */
  const updateExercise = async (id, exerciseData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedExercise = await exerciseService.updateExercise(id, exerciseData);
      
      // Mettre à jour dans la liste locale
      setExercises(prev => 
        prev.map(ex => ex._id === id ? updatedExercise : ex)
      );
      
      return updatedExercise;
    } catch (err) {
      console.error('❌ Erreur modification exercice:', err);
      setError(err.message || 'Erreur lors de la modification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprimer un exercice
   */
  const deleteExercise = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await exerciseService.deleteExercise(id);
      
      // Retirer de la liste locale
      setExercises(prev => prev.filter(ex => ex._id !== id));
      
      return true;
    } catch (err) {
      console.error('❌ Erreur suppression exercice:', err);
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Appliquer des filtres
   */
  const applyFilters = async (newFilters) => {
    await loadExercises(newFilters);
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = async () => {
    await loadExercises({});
  };

  /**
   * Charger les exercices au montage si authentifié
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadExercises();
    }
  }, [isAuthenticated]);

  const value = {
    // État
    exercises,
    loading,
    error,
    filters,
    
    // Actions
    loadExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    applyFilters,
    resetFilters,
    
    // Utilitaires
    clearError: () => setError(null),
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte
 */
export const useExercises = () => {
  const context = useContext(ExerciseContext);
  
  if (!context) {
    throw new Error('useExercises doit être utilisé dans ExerciseProvider');
  }
  
  return context;
};