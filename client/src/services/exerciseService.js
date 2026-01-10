import api from './api';

const exerciseService = {
  /**
   * Récupérer tous les exercices de l'utilisateur connecté
   */
  getExercises: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.groupeMusculaire) {
        queryParams.append('groupeMusculaire', filters.groupeMusculaire);
      }
      if (filters.difficulte) {
        queryParams.append('difficulte', filters.difficulte);
      }
      if (filters.categorie) {
        queryParams.append('categorie', filters.categorie);
      }
      
      const queryString = queryParams.toString();
      // ✅ AJOUT DU SLASH INITIAL
      const url = queryString ? `/exercises?${queryString}` : '/exercises';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération exercices:', error);
      throw error;
    }
  },

  /**
   * Récupérer un exercice par ID
   */
  getExerciseById: async (id) => {
    try {
      // ✅ AJOUT DU SLASH INITIAL
      const response = await api.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération exercice:', error);
      throw error;
    }
  },

  /**
   * Créer un nouvel exercice
   */
  createExercise: async (exerciseData) => {
    try {
      // ✅ AJOUT DU SLASH INITIAL
      const response = await api.post('/exercises', exerciseData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création exercice:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un exercice
   */
  updateExercise: async (id, exerciseData) => {
    try {
      // ✅ AJOUT DU SLASH INITIAL
      const response = await api.put(`/exercises/${id}`, exerciseData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur modification exercice:', error);
      throw error;
    }
  },

  /**
   * Supprimer un exercice
   */
  deleteExercise: async (id) => {
    try {
      // ✅ AJOUT DU SLASH INITIAL
      const response = await api.delete(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur suppression exercice:', error);
      throw error;
    }
  },

  /**
   * Récupérer les exercices par groupe musculaire
   */
  getExercisesByMuscleGroup: async (groupeMusculaire) => {
    try {
      return await exerciseService.getExercises({ groupeMusculaire });
    } catch (error) {
      console.error('❌ Erreur récupération exercices par groupe:', error);
      throw error;
    }
  },

  /**
   * Récupérer les exercices par difficulté
   */
  getExercisesByDifficulty: async (difficulte) => {
    try {
      return await exerciseService.getExercises({ difficulte });
    } catch (error) {
      console.error('❌ Erreur récupération exercices par difficulté:', error);
      throw error;
    }
  },

  /**
   * Récupérer les exercices par catégorie
   */
  getExercisesByCategory: async (categorie) => {
    try {
      return await exerciseService.getExercises({ categorie });
    } catch (error) {
      console.error('❌ Erreur récupération exercices par catégorie:', error);
      throw error;
    }
  },
};

export default exerciseService;