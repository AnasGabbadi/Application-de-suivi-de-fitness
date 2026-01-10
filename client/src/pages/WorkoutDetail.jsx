import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Edit, 
  Trash2, 
  Clock, 
  Target, 
  Dumbbell,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import workoutService from '../services/workoutService';
import Loading from '../components/common/Loading';
import { cn } from '../utils/cn';

const WorkoutDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadWorkout();
  }, [id]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkoutById(id);
      setWorkout(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du programme');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${workout.nom}" ?`)) {
      try {
        setDeleting(true);
        await workoutService.deleteWorkout(id);
        toast.success('Programme supprimé avec succès');
        navigate('/workouts');
      } catch (error) {
        toast.error(error.message || 'Erreur lors de la suppression');
        setDeleting(false);
      }
    }
  };

  const difficultyColors = {
    'Débutant': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Avancé': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du programme..." />;
  }

  if (!workout) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-800 dark:text-red-200 font-medium">
            Programme introuvable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/workouts')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour aux programmes</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {workout.nom}
            </h1>
            {workout.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                {workout.description}
              </p>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {workout.difficulte && (
                <span className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
                  difficultyColors[workout.difficulte]
                )}>
                  <Target className="h-4 w-4 mr-1.5" />
                  {workout.difficulte}
                </span>
              )}
              {workout.duree && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {workout.duree} min
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Dumbbell className="h-4 w-4 mr-1.5" />
                {workout.exercices?.length || 0} exercices
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link
              to={`/workouts/${id}/start`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              <span className="font-medium">Démarrer</span>
            </Link>
            <Link
              to={`/workouts/${id}/edit`}
              className="p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Modifier"
            >
              <Edit className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={cn(
                'p-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
                deleting && 'opacity-50 cursor-not-allowed'
              )}
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Exercices du programme
          </h2>
        </div>

        {workout.exercices && workout.exercices.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {workout.exercices.map((item, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Numéro */}
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 dark:text-primary-300 font-bold">
                        {item.ordre || index + 1}
                      </span>
                    </div>

                    {/* Info exercice */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.exerciceId?.nom || 'Exercice inconnu'}
                      </h3>
                      
                      {item.exerciceId?.groupeMusculaire && (
                        <div className="flex items-center space-x-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.exerciceId.groupeMusculaire}
                          </span>
                        </div>
                      )}

                      {/* Séries/Reps/Repos */}
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Séries:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {item.seriesCible || 3}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Répétitions:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {item.repsCible || 10}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Repos:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {item.tempsRepos || 60}s
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun exercice dans ce programme
            </p>
          </div>
        )}
      </div>

      {/* Bouton démarrer en bas */}
      {workout.exercices && workout.exercices.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            to={`/workouts/${id}/start`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="h-6 w-6" />
            <span>Démarrer ce programme</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;