import { useState, useEffect } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutCard from '../workouts/WorkoutCard';
import Loading from '../common/Loading';
import workoutService from '../../services/workoutService';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutService.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w._id !== id));
      toast.success('Programme supprimé avec succès');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const canEdit = (workout) => {
    // ✅ CORRIGÉ : Vérifier user, createdBy, ou userId selon ton modèle
    return user && (
      user._id === workout.user?._id || 
      user._id === workout.createdBy || 
      user._id === workout.userId
    );
  };

  if (loading) {
    return <Loading fullScreen message="Chargement des programmes..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-800 dark:text-red-200 font-medium mb-4">
            {error}
          </p>
          <button
            onClick={loadWorkouts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mes programmes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {workouts.length} programme{workouts.length > 1 ? 's' : ''} d'entraînement
          </p>
        </div>
        <Link
          to="/workouts/create"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Créer un programme</span>
        </Link>
      </div>

      {/* Grid */}
      {workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
              onDelete={handleDelete}
              canEdit={canEdit(workout)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun programme d'entraînement
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Créez votre premier programme pour commencer à vous entraîner
          </p>
          <Link
            to="/workouts/create"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Créer mon premier programme</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;