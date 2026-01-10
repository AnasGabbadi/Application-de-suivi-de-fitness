import api from './api';

const workoutService = {
  /**
   * Récupérer tous les programmes
   */
  getWorkouts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/workouts?${queryString}` : '/workouts';
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Récupérer un programme par ID
   */
  getWorkoutById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau programme
   */
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  /**
   * Mettre à jour un programme
   */
  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  /**
   * Supprimer un programme
   */
  deleteWorkout: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },

  /**
   * Dupliquer un programme
   */
  duplicateWorkout: async (id) => {
    const response = await api.post(`/workouts/${id}/duplicate`);
    return response.data;
  },

  /**
   * Récupérer les programmes récents
   */
  getRecentWorkouts: async (limit = 5) => {
    const response = await api.get(`/workouts?limit=${limit}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques des programmes
   */
  getStats: async () => {
    const response = await api.get('/workouts/stats');
    return response.data;
  },
};

export default workoutService;