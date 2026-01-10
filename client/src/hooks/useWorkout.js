import { useContext } from 'react';
import { WorkoutContext } from '../contexts/WorkoutContext';

/**
 * Hook pour accéder au contexte de workout
 * @returns {Object} Contexte de workout
 */
const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout doit être utilisé à l\'intérieur d\'un WorkoutProvider');
  }
  
  return context;
};

export default useWorkout;