import { createContext, useState, useEffect } from 'react';
import workoutService from '../services/workoutService';
import logService from '../services/logService';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [error, setError] = useState(null);

  // Charger l'état depuis le localStorage au démarrage
  useEffect(() => {
    loadWorkoutState();
  }, []);

  // Sauvegarder l'état dans le localStorage à chaque changement
  useEffect(() => {
    if (workoutInProgress) {
      saveWorkoutState();
    } else {
      clearWorkoutState();
    }
  }, [
    currentWorkout,
    workoutInProgress,
    currentExerciseIndex,
    exerciseLogs,
    workoutStartTime,
    workoutNotes,
  ]);

  // Charger l'état sauvegardé
  const loadWorkoutState = () => {
    try {
      const savedState = localStorage.getItem('workoutState');
      if (savedState) {
        const state = JSON.parse(savedState);
        setCurrentWorkout(state.currentWorkout);
        setWorkoutInProgress(state.workoutInProgress);
        setCurrentExerciseIndex(state.currentExerciseIndex);
        setExerciseLogs(state.exerciseLogs);
        setWorkoutStartTime(state.workoutStartTime);
        setWorkoutNotes(state.workoutNotes);
      }
    } catch (error) {
      console.error('Erreur chargement état workout:', error);
    }
  };

  // Sauvegarder l'état
  const saveWorkoutState = () => {
    try {
      const state = {
        currentWorkout,
        workoutInProgress,
        currentExerciseIndex,
        exerciseLogs,
        workoutStartTime,
        workoutNotes,
      };
      localStorage.setItem('workoutState', JSON.stringify(state));
    } catch (error) {
      console.error('Erreur sauvegarde état workout:', error);
    }
  };

  // Effacer l'état sauvegardé
  const clearWorkoutState = () => {
    try {
      localStorage.removeItem('workoutState');
    } catch (error) {
      console.error('Erreur suppression état workout:', error);
    }
  };

  // Démarrer une séance
  const startWorkout = async (workoutId) => {
    try {
      setError(null);
      
      // Récupérer le workout depuis l'API
      const workout = await workoutService.getWorkoutById(workoutId);
      
      setCurrentWorkout(workout);
      setWorkoutInProgress(true);
      setCurrentExerciseIndex(0);
      setExerciseLogs([]);
      setWorkoutStartTime(new Date().toISOString());
      setWorkoutNotes('');
      
      return workout;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Passer à l'exercice suivant
  const nextExercise = () => {
    if (currentWorkout && currentExerciseIndex < currentWorkout.exercices.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      return true;
    }
    return false;
  };

  // Revenir à l'exercice précédent
  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      return true;
    }
    return false;
  };

  // Aller à un exercice spécifique
  const goToExercise = (index) => {
    if (currentWorkout && index >= 0 && index < currentWorkout.exercices.length) {
      setCurrentExerciseIndex(index);
      return true;
    }
    return false;
  };

  // Enregistrer les séries d'un exercice
  const logExercise = (exerciceId, sets) => {
    try {
      setError(null);
      
      // Format backend: { exerciceId, series: [{ poids, reps }] }
      const log = {
        exerciceId,
        series: sets.map(set => ({
          poids: parseFloat(set.poids) || 0,
          reps: parseInt(set.repetitions || set.reps) || 0,
        })),
      };

      // Vérifier si un log existe déjà pour cet exercice
      const existingIndex = exerciseLogs.findIndex(
        log => log.exerciceId === exerciceId
      );

      if (existingIndex >= 0) {
        // Mettre à jour le log existant
        const updatedLogs = [...exerciseLogs];
        updatedLogs[existingIndex] = log;
        setExerciseLogs(updatedLogs);
      } else {
        // Ajouter un nouveau log
        setExerciseLogs([...exerciseLogs, log]);
      }

      return log;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Mettre à jour les notes de la séance
  const updateNotes = (notes) => {
    setWorkoutNotes(notes);
  };

  // Calculer la durée de la séance (en minutes)
  const getWorkoutDuration = () => {
    if (!workoutStartTime) return 0;
    const start = new Date(workoutStartTime);
    const now = new Date();
    return Math.floor((now - start) / 1000 / 60); // en minutes
  };

  // Terminer la séance et l'enregistrer
  const finishWorkout = async () => {
    try {
      setError(null);
      
      if (!currentWorkout) {
        throw new Error('Aucune séance en cours');
      }

      if (exerciseLogs.length === 0) {
        throw new Error('Aucun exercice enregistré');
      }

      const duration = getWorkoutDuration();
      
      // Créer le log avec le format backend
      const logData = {
        workoutId: currentWorkout._id,
        exercices: exerciseLogs,
        notes: workoutNotes,
        duree: duration,
        date: workoutStartTime,
      };

      // Enregistrer via l'API
      const savedLog = await logService.createLog(logData);

      // Réinitialiser l'état
      resetWorkout();

      return savedLog;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Abandonner la séance
  const cancelWorkout = () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir abandonner cette séance ? Toutes les données seront perdues.'
    );
    
    if (confirmed) {
      resetWorkout();
      return true;
    }
    
    return false;
  };

  // Réinitialiser l'état du workout
  const resetWorkout = () => {
    setCurrentWorkout(null);
    setWorkoutInProgress(false);
    setCurrentExerciseIndex(0);
    setExerciseLogs([]);
    setWorkoutStartTime(null);
    setWorkoutNotes('');
    setError(null);
  };

  // Obtenir l'exercice actuel
  const getCurrentExercise = () => {
    if (!currentWorkout || !currentWorkout.exercices) return null;
    return currentWorkout.exercices[currentExerciseIndex];
  };

  // Obtenir les logs de l'exercice actuel
  const getCurrentExerciseLogs = () => {
    const currentEx = getCurrentExercise();
    if (!currentEx) return null;
    
    const exerciceId = currentEx.exerciceId?._id || currentEx.exerciceId;
    return exerciseLogs.find(log => log.exerciceId === exerciceId);
  };

  // Obtenir la progression (pourcentage)
  const getProgress = () => {
    if (!currentWorkout || !currentWorkout.exercices) return 0;
    return Math.round(((currentExerciseIndex + 1) / currentWorkout.exercices.length) * 100);
  };

  // Obtenir le nombre d'exercices complétés
  const getCompletedExercisesCount = () => {
    return exerciseLogs.length;
  };

  // Vérifier si un exercice est complété
  const isExerciseCompleted = (exerciceId) => {
    return exerciseLogs.some(log => log.exerciceId === exerciceId);
  };

  // Valeurs exposées par le contexte
  const value = {
    // État
    currentWorkout,
    workoutInProgress,
    currentExerciseIndex,
    exerciseLogs,
    workoutStartTime,
    workoutNotes,
    error,

    // Actions
    startWorkout,
    nextExercise,
    previousExercise,
    goToExercise,
    logExercise,
    updateNotes,
    finishWorkout,
    cancelWorkout,
    resetWorkout,

    // Getters
    getCurrentExercise,
    getCurrentExerciseLogs,
    getProgress,
    getWorkoutDuration,
    getCompletedExercisesCount,
    isExerciseCompleted,

    // Utils
    clearError: () => setError(null),
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};