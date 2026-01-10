import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import exerciseService from '../services/exerciseService';
import Loading from '../components/common/Loading';

const CreateExercise = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si id existe, on est en mode édition
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    groupeMusculaire: '',
    categorie: 'Force',
    difficulte: 'Débutant',
    imageUrl: '',
  });

  const groupesMusculaires = [
    'Pectoraux',
    'Dos',
    'Jambes',
    'Épaules',
    'Biceps',
    'Triceps',
    'Abdominaux',
    'Cardio',
  ];

  const categories = ['Force', 'Cardio', 'Flexibilité'];
  const difficultes = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Charger l'exercice si on est en mode édition
  useEffect(() => {
    if (isEditMode) {
      loadExercise();
    }
  }, [id]);

  const loadExercise = async () => {
    try {
      setInitialLoading(true);
      const data = await exerciseService.getExerciseById(id);
      setFormData({
        nom: data.nom || '',
        description: data.description || '',
        groupeMusculaire: data.groupeMusculaire || '',
        categorie: data.categorie || 'Force',
        difficulte: data.difficulte || 'Débutant',
        imageUrl: data.imageUrl || '',
      });
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'exercice');
      navigate('/exercises');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      toast.error('Le nom de l\'exercice est requis');
      return;
    }

    if (!formData.groupeMusculaire) {
      toast.error('Veuillez sélectionner un groupe musculaire');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await exerciseService.updateExercise(id, formData);
        toast.success('Exercice modifié avec succès !');
      } else {
        await exerciseService.createExercise(formData);
        toast.success('Exercice créé avec succès !');
      }
      navigate('/exercises');
    } catch (error) {
      toast.error(error.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading fullScreen message="Chargement de l'exercice..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/exercises')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour aux exercices</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Modifier l\'exercice' : 'Créer un exercice'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode 
            ? 'Modifiez les informations de votre exercice'
            : 'Ajoutez un nouvel exercice à votre bibliothèque'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
        {/* Nom */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom de l'exercice *
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            value={formData.nom}
            onChange={handleChange}
            placeholder="Ex: Pompes, Squats, Développé couché..."
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
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez l'exercice, sa technique, les muscles ciblés..."
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Groupe musculaire */}
        <div>
          <label
            htmlFor="groupeMusculaire"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Groupe musculaire *
          </label>
          <select
            id="groupeMusculaire"
            name="groupeMusculaire"
            required
            value={formData.groupeMusculaire}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un groupe</option>
            {groupesMusculaires.map((groupe) => (
              <option key={groupe} value={groupe}>
                {groupe}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie et Difficulté */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Catégorie */}
          <div>
            <label
              htmlFor="categorie"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Catégorie
            </label>
            <select
              id="categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulté */}
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
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            URL de l'image (optionnel)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Preview image si URL fournie */}
        {formData.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Aperçu de l'image
            </label>
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/exercises')}
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
                : (isEditMode ? 'Modifier l\'exercice' : 'Créer l\'exercice')
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExercise;