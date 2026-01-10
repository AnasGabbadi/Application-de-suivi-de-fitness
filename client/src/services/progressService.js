import api from './api';

const progressService = {
  /**
   * Récupérer toutes les mesures de progression
   */
  getProgress: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/progress?${queryString}` : '/progress';
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Récupérer une mesure par ID
   */
  getProgressById: async (id) => {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },

  /**
   * Ajouter une nouvelle mesure
   */
  addProgress: async (progressData) => {
    const response = await api.post('/progress', progressData);
    return response.data;
  },

  /**
   * Mettre à jour une mesure
   */
  updateProgress: async (id, progressData) => {
    const response = await api.put(`/progress/${id}`, progressData);
    return response.data;
  },

  /**
   * Supprimer une mesure
   */
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques de progression
   */
  getStats: async () => {
    const response = await api.get('/progress/stats');
    return response.data;
  },

  /**
   * Récupérer la dernière mesure
   */
  getLatest: async () => {
    const response = await api.get('/progress/latest');
    return response.data;
  },

  /**
   * Récupérer l'évolution du poids
   */
  getWeightHistory: async (days = 30) => {
    const response = await api.get(`/progress/weight?days=${days}`);
    return response.data;
  },
};

export default progressService;