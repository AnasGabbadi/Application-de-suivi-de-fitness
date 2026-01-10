import api from './api';

const userService = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Mettre à jour le profil
   */
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    
    // Mettre à jour le user dans localStorage
    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  /**
   * Obtenir les statistiques utilisateur
   */
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  /**
   * Obtenir le dashboard de l'utilisateur
   */
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },

  /**
   * Uploader une photo de profil
   */
  uploadAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    
    const response = await api.upload('/users/avatar', formData);
    
    // Mettre à jour le user dans localStorage
    if (response.success) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.avatar = response.data.avatar;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    return response.data;
  },

  /**
   * Supprimer son compte
   */
  deleteAccount: async (password) => {
    const response = await api.delete('/users/account', { password });
    return response.data;
  },
};

export default userService;