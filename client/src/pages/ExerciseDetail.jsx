import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Dumbbell,
  TrendingUp,
  Award,
  Info
} from 'lucide-react';
import exerciseService from '../services/exerciseService';
import useAuth from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseService.getExerciseById(id);
      setExercise(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${exercise.nom}" ?`)) {
      try {
        await exerciseService.deleteExercise(id);
        toast.success('Exercice supprimé avec succès');
        navigate('/exercises');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const canEdit = user && (user.role === 'admin' || user._id === exercise?.createdBy);

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

  if (loading) {
    return <Loading fullScreen message="Chargement de l'exercice..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={loadExercise} />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Exercice introuvable" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Retour</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Image */}
            <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-600">
              {exercise.imageUrl && !imageError ? (
                <img
                  src={exercise.imageUrl}
                  alt={exercise.nom}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Dumbbell className="h-24 w-24 text-primary-400 dark:text-primary-500" />
                </div>
              )}
              
              {/* Overlay badges */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  difficultyColors[exercise.difficulte]
                )}>
                  {exercise.difficulte}
                </span>
                {exercise.categorie && (
                  <span className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium',
                    categoryColors[exercise.categorie]
                  )}>
                    {exercise.categorie}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {exercise.nom}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">{exercise.groupeMusculaire}</span>
                  </div>
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/exercises/${exercise._id}/edit`}
                      className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              {exercise.description && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {exercise.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Instructions
                </h2>
              </div>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-700 dark:text-gray-300 pt-1">
                      {instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Conseils */}
          {exercise.conseils && exercise.conseils.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Conseils
              </h2>
              <ul className="space-y-2">
                {exercise.conseils.map((conseil, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <p className="text-gray-700 dark:text-gray-300">{conseil}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Informations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Groupe musculaire
                </p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exercise.groupeMusculaire}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Difficulté
                </p>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exercise.difficulte}
                  </p>
                </div>
              </div>

              {exercise.categorie && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Catégorie
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exercise.categorie}
                  </p>
                </div>
              )}

              {exercise.equipement && exercise.equipement.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Équipement
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipement.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add to Workout CTA */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              Ajouter à un programme
            </h3>
            <p className="text-primary-100 mb-4 text-sm">
              Intégrez cet exercice dans vos programmes d'entraînement
            </p>
            <Link
              to="/workouts/create"
              className="block w-full text-center px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Créer un programme
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;