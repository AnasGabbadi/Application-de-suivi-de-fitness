import { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  X, 
  Search,
  GripVertical,
  Trash2
} from 'lucide-react';
import useForm from '../../hooks/useForm';
import { validateWorkout } from '../../utils/validators';
import exerciseService from '../../services/exerciseService';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const WorkoutForm = ({ initialData, onSubmit, isSubmitting }) => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm(
    initialData || {
      nom: '',
      description: '',
      exercices: [],
    },
    validateWorkout
  );

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getExercises();
      setExercises(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des exercices');
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addExercise = (exercise) => {
    const newExercise = {
      exerciceId: exercise._id,
      exerciceData: exercise,
      seriesCible: 3,
      repsCible: 10,
      tempsRepos: 60,
      ordre: values.exercices.length + 1,
    };

    setFieldValue('exercices', [...values.exercices, newExercise]);
    setShowExerciseSelector(false);
    setSearchTerm('');
    toast.success(`${exercise.nom} ajouté`);
  };

  const removeExercise = (index) => {
    const newExercices = values.exercices.filter((_, i) => i !== index);
    // Réorganiser les ordres
    const reordered = newExercices.map((ex, i) => ({ ...ex, ordre: i + 1 }));
    setFieldValue('exercices', reordered);
  };

  const updateExercise = (index, field, value) => {
    const newExercices = [...values.exercices];
    newExercices[index] = {
      ...newExercices[index],
      [field]: parseInt(value) || 0,
    };
    setFieldValue('exercices', newExercices);
  };

  const moveExercise = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= values.exercices.length) return;

    const newExercices = [...values.exercices];
    [newExercices[index], newExercices[newIndex]] = [newExercices[newIndex], newExercices[index]];
    
    // Mettre à jour les ordres
    newExercices[index].ordre = index + 1;
    newExercices[newIndex].ordre = newIndex + 1;
    
    setFieldValue('exercices', newExercices);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom du programme *
        </label>
        <input
          type="text"
          name="nom"
          value={values.nom}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            'block w-full px-4 py-3 border rounded-lg',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            errors.nom ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
          )}
          placeholder="Ex: Programme full body débutant"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          className={cn(
            'block w-full px-4 py-3 border rounded-lg',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            errors.description ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
          )}
          placeholder="Décrivez votre programme d'entraînement..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Exercices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exercices du programme *
          </label>
          <button
            type="button"
            onClick={() => setShowExerciseSelector(!showExerciseSelector)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter exercice</span>
          </button>
        </div>

        {errors.exercices && (
          <p className="mb-3 text-sm text-red-600">{errors.exercices}</p>
        )}

        {/* Exercise selector */}
        {showExerciseSelector && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un exercice..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredExercises.map((exercise) => {
                const isAdded = values.exercices.some(
                  ex => ex.exerciceId === exercise._id
                );
                
                return (
                  <button
                    key={exercise._id}
                    type="button"
                    onClick={() => !isAdded && addExercise(exercise)}
                    disabled={isAdded}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
                      isAdded
                        ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50'
                        : 'bg-white dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    )}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {exercise.nom}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.groupeMusculaire}
                      </p>
                    </div>
                    {isAdded && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Ajouté
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Liste des exercices ajoutés */}
        {values.exercices.length > 0 ? (
          <div className="space-y-3">
            {values.exercices.map((ex, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  {/* Drag handle */}
                  <div className="flex flex-col space-y-1 pt-2">
                    <button
                      type="button"
                      onClick={() => moveExercise(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <GripVertical className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExercise(index, 'down')}
                      disabled={index === values.exercices.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Nom exercice */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {ex.exerciceData?.nom || 'Exercice'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ex.exerciceData?.groupeMusculaire}
                      </p>
                    </div>

                    {/* Paramètres */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Séries
                        </label>
                        <input
                          type="number"
                          value={ex.seriesCible}
                          onChange={(e) => updateExercise(index, 'seriesCible', e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Répétitions
                        </label>
                        <input
                          type="number"
                          value={ex.repsCible}
                          onChange={(e) => updateExercise(index, 'repsCible', e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Repos (s)
                        </label>
                        <input
                          type="number"
                          value={ex.tempsRepos}
                          onChange={(e) => updateExercise(index, 'tempsRepos', e.target.value)}
                          min="0"
                          step="15"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucun exercice ajouté. Cliquez sur "Ajouter exercice" pour commencer.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-medium',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Enregistrer</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default WorkoutForm;