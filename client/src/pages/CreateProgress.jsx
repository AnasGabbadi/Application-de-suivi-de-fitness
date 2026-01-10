import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Weight, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';
import progressService from '../services/progressService';

const CreateProgress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    poids: '',
    date: new Date().toISOString().split('T')[0],
    mensurations: {
      tourTaille: '',
      tourPoitrine: '',
      tourBras: '',
      tourCuisses: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('mensurations.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        mensurations: {
          ...prev.mensurations,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.poids) {
      toast.error('Le poids est requis');
      return;
    }

    setLoading(true);

    try {
      // Préparer les données
      const progressData = {
        poids: parseFloat(formData.poids),
        date: new Date(formData.date).toISOString(),
      };

      // Ajouter les mensurations si renseignées
      const mensurations = {};
      if (formData.mensurations.tourTaille) {
        mensurations.tourTaille = parseInt(formData.mensurations.tourTaille);
      }
      if (formData.mensurations.tourPoitrine) {
        mensurations.tourPoitrine = parseInt(formData.mensurations.tourPoitrine);
      }
      if (formData.mensurations.tourBras) {
        mensurations.tourBras = parseInt(formData.mensurations.tourBras);
      }
      if (formData.mensurations.tourCuisses) {
        mensurations.tourCuisses = parseInt(formData.mensurations.tourCuisses);
      }

      if (Object.keys(mensurations).length > 0) {
        progressData.mensurations = mensurations;
      }

      await progressService.addProgress(progressData);
      toast.success('Mesure ajoutée avec succès !');
      navigate('/progress');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/progress')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ajouter une mesure
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enregistrez vos mensurations pour suivre votre progression
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Poids et Date */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Weight className="h-5 w-5 text-primary-600" />
            <span>Informations principales</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poids */}
            <div>
              <label
                htmlFor="poids"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Poids (kg) *
              </label>
              <input
                id="poids"
                name="poids"
                type="number"
                step="0.1"
                min="30"
                max="300"
                required
                value={formData.poids}
                onChange={handleChange}
                placeholder="75.5"
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mensurations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-primary-600" />
            <span>Mensurations (optionnel)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tour de taille */}
            <div>
              <label
                htmlFor="tourTaille"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tour de taille (cm)
              </label>
              <input
                id="tourTaille"
                name="mensurations.tourTaille"
                type="number"
                min="40"
                max="200"
                value={formData.mensurations.tourTaille}
                onChange={handleChange}
                placeholder="85"
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tour de poitrine */}
            <div>
              <label
                htmlFor="tourPoitrine"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tour de poitrine (cm)
              </label>
              <input
                id="tourPoitrine"
                name="mensurations.tourPoitrine"
                type="number"
                min="50"
                max="200"
                value={formData.mensurations.tourPoitrine}
                onChange={handleChange}
                placeholder="100"
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tour de bras */}
            <div>
              <label
                htmlFor="tourBras"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tour de bras (cm)
              </label>
              <input
                id="tourBras"
                name="mensurations.tourBras"
                type="number"
                min="15"
                max="80"
                value={formData.mensurations.tourBras}
                onChange={handleChange}
                placeholder="35"
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tour de cuisses */}
            <div>
              <label
                htmlFor="tourCuisses"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tour de cuisses (cm)
              </label>
              <input
                id="tourCuisses"
                name="mensurations.tourCuisses"
                type="number"
                min="30"
                max="120"
                value={formData.mensurations.tourCuisses}
                onChange={handleChange}
                placeholder="60"
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/progress')}
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
            <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgress;