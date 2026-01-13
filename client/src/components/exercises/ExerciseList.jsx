import { useState, useEffect } from 'react';
import { Plus, Dumbbell, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExerciseCard from './ExerciseCard';
import ExerciseFilter from './ExerciseFilter';
import Loading from '../common/Loading';
import exerciseService from '../../services/exerciseService';
import useAuth from '../../hooks/useAuth';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseService.getExercises();
      setExercises(data);
      setFilteredExercises(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...exercises];

    // Filtre par groupe musculaire
    if (filters.groupeMusculaire) {
      filtered = filtered.filter(
        (ex) => ex.groupeMusculaire === filters.groupeMusculaire
      );
    }

    // Filtre par difficulté
    if (filters.difficulte) {
      filtered = filtered.filter((ex) => ex.difficulte === filters.difficulte);
    }

    // Filtre par catégorie
    if (filters.categorie) {
      filtered = filtered.filter((ex) => ex.categorie === filters.categorie);
    }

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.nom.toLowerCase().includes(searchLower) ||
          ex.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredExercises(filtered);
  };

  const handleDelete = async (id) => {
    await exerciseService.deleteExercise(id);
    setExercises(exercises.filter((ex) => ex._id !== id));
    setFilteredExercises(filteredExercises.filter((ex) => ex._id !== id));
  };

  const canEdit = (exercise) => {
    // ✅ Tous les utilisateurs peuvent éditer leurs propres exercices
    return user && user._id === exercise.createdBy;
  };

  if (loading) {
    return <Loading message="Chargement des exercices..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
              Erreur de chargement
            </h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Dumbbell className="text-blue-500" />
            Exercices
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez {exercises.length} exercice{exercises.length > 1 ? 's' : ''} pour tous les groupes musculaires
          </p>
        </div>
        <Link
          to="/exercises/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl w-fit"
        >
          <Plus size={20} />
          Nouvel exercice
        </Link>
      </div>

      {/* Filtres */}
      <ExerciseFilter onFilterChange={handleFilterChange} />

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredExercises.length}{' '}
          exercice{filteredExercises.length > 1 ? 's' : ''} trouvé{filteredExercises.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des exercices */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Dumbbell className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Aucun exercice trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Essayez de modifier vos filtres ou créez un nouvel exercice
          </p>
          <Link
            to="/exercises/create"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <Plus size={18} />
            Créer un exercice
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              onDelete={handleDelete}
              canEdit={canEdit(exercise)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;