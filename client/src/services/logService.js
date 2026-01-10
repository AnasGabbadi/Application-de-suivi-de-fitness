import api from './api';

const logService = {
  /**
   * Récupérer tous les logs
   */
  getLogs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }
    if (filters.workoutId) {
      queryParams.append('workoutId', filters.workoutId);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/logs?${queryString}` : '/logs';
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Récupérer un log par ID
   */
  getLogById: async (id) => {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau log
   */
  createLog: async (logData) => {
    const response = await api.post('/logs', logData);
    return response.data;
  },

  /**
   * Supprimer un log
   */
  deleteLog: async (id) => {
    const response = await api.delete(`/logs/${id}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques des logs
   */
  getStats: async () => {
    const response = await api.get('/logs/stats');
    return response.data;
  },

  /**
   * Récupérer les logs récents (limité)
   */
  getRecentLogs: async (limit = 5) => {
    const response = await api.get(`/logs?limit=${limit}`);
    return response.data;
  },

  /**
   * Récupérer le calendrier des séances
   */
  getCalendar: async (year, month) => {
    const response = await api.get(`/logs/calendar?year=${year}&month=${month}`);
    return response.data;
  },
};

export default logService;