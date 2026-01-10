import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Play,
  Clock,
  Dumbbell,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import toast from 'react-hot-toast';

const WorkoutCard = ({ workout, onDelete, canEdit = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const difficultyColors = {
    'Débutant': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Avancé': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${workout.nom}" ?`)) {
      try {
        setIsDeleting(true);
        await onDelete(workout._id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const exerciseCount = workout.exercices?.length || 0;
  const estimatedDuration = workout.duree || exerciseCount * 5;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Header avec gradient */}
      <div className="relative h-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-5">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-white line-clamp-1 flex-1">
              {workout.nom}
            </h3>
            {workout.difficulte && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                difficultyColors[workout.difficulte]
              )}>
                {workout.difficulte}
              </span>
            )}
          </div>
          <p className="text-primary-100 text-sm line-clamp-2">
            {workout.description || 'Aucune description'}
          </p>
        </div>
        
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Exercices</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {exerciseCount}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Durée</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {estimatedDuration} min
              </p>
            </div>
          </div>
        </div>

        {/* Exercices preview */}
        {workout.exercices && workout.exercices.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              EXERCICES INCLUS
            </p>
            <div className="space-y-1">
              {workout.exercices.slice(0, 3).map((ex, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <TrendingUp className="h-3 w-3 text-primary-500" />
                  <span className="truncate">
                    {ex.exercice?.nom || ex.exerciceId?.nom || 'Exercice'}
                  </span>
                </div>
              ))}
              {workout.exercices.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  +{workout.exercices.length - 3} autre(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Start workout */}
          <Link
            to={`/workouts/${workout._id}/start`}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-sm hover:shadow"
          >
            <Play className="h-4 w-4" />
            <span>Démarrer</span>
          </Link>

          {/* View details */}
          <Link
            to={`/workouts/${workout._id}`}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Voir détails"
          >
            <BookOpen className="h-5 w-5" />
          </Link>

          {/* Edit */}
          {canEdit && (
            <>
              <Link
                to={`/workouts/${workout._id}/edit`}
                className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </Link>

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors',
                  isDeleting && 'opacity-50 cursor-not-allowed'
                )}
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;