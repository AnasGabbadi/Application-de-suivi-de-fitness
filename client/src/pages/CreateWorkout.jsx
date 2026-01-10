import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import workoutService from '../services/workoutService';
import exerciseService from '../services/exerciseService';
import Loading from '../components/common/Loading';

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [exercises, setExercises] = useState([]);
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    difficulte: 'Débutant',
    duree: 30,
    exercices: [],
  });

  const difficultes = ['Débutant', 'Intermédiaire', 'Avancé'];

  useEffect(() => {
    loadExercises();
    if (isEditMode) {
      loadWorkout();
    }
  }, [id]);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getExercises();
      setExercises(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des exercices');
    }
  };

  const loadWorkout = async () => {
    try {
      setInitialLoading(true);
      const data = await workoutService.getWorkoutById(id);
      
      console.log('📦 Workout chargé:', data);
      
      // ✅ TRANSFORMER LES DONNÉES DU BACKEND VERS LE FORMULAIRE
      const formattedExercises = (data.exercices || []).map(ex => ({
        exercice: ex.exerciceId?._id || ex.exerciceId || '',      // ✅ exerciceId → exercice
        series: ex.seriesCible || 3,                               // ✅ seriesCible → series
        repetitions: ex.repsCible || 10,                           // ✅ repsCible → repetitions
        repos: ex.tempsRepos || 60,                                // ✅ tempsRepos → repos
        notes: ex.notes || '',
      }));

      setFormData({
        nom: data.nom || '',
        description: data.description || '',
        difficulte: data.difficulte || 'Débutant',
        duree: data.duree || 30,
        exercices: formattedExercises,
      });
    } catch (error) {
      console.error('❌ Erreur loadWorkout:', error);
      toast.error(error.message || 'Erreur lors du chargement du programme');
      navigate('/workouts');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duree' ? parseInt(value) || 0 : value,
    }));
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercices: [
        ...prev.exercices,
        {
          exercice: '',
          series: 3,
          repetitions: 10,
          repos: 60,
          notes: '',
        },
      ],
    }));
  };

  const removeExercise = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercices: prev.exercices.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      exercices: prev.exercices.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      toast.error('Le nom du programme est requis');
      return;
    }

    if (formData.exercices.length === 0) {
      toast.error('Ajoutez au moins un exercice');
      return;
    }

    // Vérifier que tous les exercices sont sélectionnés
    const hasEmptyExercise = formData.exercices.some((ex) => !ex.exercice);
    if (hasEmptyExercise) {
      toast.error('Veuillez sélectionner tous les exercices');
      return;
    }

    setLoading(true);

    try {
      // ✅ TRANSFORMER LES DONNÉES POUR LE BACKEND
      const workoutData = {
        nom: formData.nom,
        description: formData.description,
        difficulte: formData.difficulte,
        duree: formData.duree,
        exercices: formData.exercices.map((ex, index) => ({
          exerciceId: ex.exercice,                    // ✅ exercice → exerciceId
          seriesCible: parseInt(ex.series) || 3,      // ✅ series → seriesCible
          repsCible: parseInt(ex.repetitions) || 10,  // ✅ repetitions → repsCible
          tempsRepos: parseInt(ex.repos) || 60,       // ✅ repos → tempsRepos
          ordre: index + 1,                           // ✅ Ajouter ordre
        })),
      };

      console.log('📤 Envoi workout:', workoutData);

      if (isEditMode) {
        await workoutService.updateWorkout(id, workoutData);
        toast.success('Programme modifié avec succès !');
      } else {
        await workoutService.createWorkout(workoutData);
        toast.success('Programme créé avec succès !');
      }
      navigate('/workouts');
    } catch (error) {
      console.error('❌ Erreur submit:', error);
      toast.error(error.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading fullScreen message="Chargement du programme..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/workouts')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour aux programmes</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Modifier le programme' : 'Créer un programme'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode
            ? 'Modifiez les informations de votre programme'
            : 'Créez un nouveau programme d\'entraînement personnalisé'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Informations générales
          </h2>

          {/* Nom */}
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nom du programme *
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Programme prise de masse, Full Body..."
              className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre programme..."
              className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Difficulté et Durée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="difficulte"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Difficulté
              </label>
              <select
                id="difficulte"
                name="difficulte"
                value={formData.difficulte}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {difficultes.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="duree"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Durée estimée (minutes)
              </label>
              <input
                id="duree"
                name="duree"
                type="number"
                min="1"
                value={formData.duree}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Exercices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Exercices ({formData.exercices.length})
            </h2>
            <button
              type="button"
              onClick={addExercise}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un exercice</span>
            </button>
          </div>

          {formData.exercices.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aucun exercice ajouté
              </p>
              <button
                type="button"
                onClick={addExercise}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter le premier exercice</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.exercices.map((exercise, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Exercice {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sélection de l'exercice */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exercice *
                    </label>
                    <select
                      value={exercise.exercice}
                      onChange={(e) =>
                        updateExercise(index, 'exercice', e.target.value)
                      }
                      className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionnez un exercice</option>
                      {exercises.map((ex) => (
                        <option key={ex._id} value={ex._id}>
                          {ex.nom} - {ex.groupeMusculaire}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Séries, Répétitions, Repos */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Séries
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.series}
                        onChange={(e) =>
                          updateExercise(index, 'series', e.target.value)
                        }
                        className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Répétitions
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.repetitions}
                        onChange={(e) =>
                          updateExercise(index, 'repetitions', e.target.value)
                        }
                        className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Repos (s)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.repos}
                        onChange={(e) =>
                          updateExercise(index, 'repos', e.target.value)
                        }
                        className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (optionnel)
                    </label>
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) =>
                        updateExercise(index, 'notes', e.target.value)
                      }
                      placeholder="Ex: Bien contrôler le mouvement..."
                      className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <Save className="h-5 w-5" />
            <span>
              {loading
                ? (isEditMode ? 'Modification...' : 'Création...')
                : (isEditMode ? 'Modifier le programme' : 'Créer le programme')
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkout;