import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ExerciseCard = ({ exercise, onDelete, canEdit = false }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const difficultyColors = {
    'Débutant': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Avancé': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const categoryColors = {
    'Force': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Cardio': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Flexibilité': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const handleCardClick = () => {
    navigate(`/exercises/${exercise._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/exercises/${exercise._id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${exercise.nom}" ?`)) {
      try {
        setIsDeleting(true);
        await onDelete(exercise._id);
        toast.success('Exercice supprimé avec succès');
      } catch (error) {
        toast.error(error.message || 'Erreur lors de la suppression');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
        {exercise.imageUrl && !imageError ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Dumbbell className="h-16 w-16 text-primary-400 dark:text-primary-500" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Tags en overlay */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            difficultyColors[exercise.difficulte]
          )}>
            {exercise.difficulte}
          </span>
          {exercise.categorie && (
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              categoryColors[exercise.categorie]
            )}>
              {exercise.categorie}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Titre */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {exercise.nom}
        </h3>

        {/* Description */}
        {exercise.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {exercise.description}
          </p>
        )}

        {/* Groupe musculaire */}
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {exercise.groupeMusculaire}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Voir détails
            </span>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors',
                  isDeleting && 'opacity-50 cursor-not-allowed'
                )}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;