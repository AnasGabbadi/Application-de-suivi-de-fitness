const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur de connexion');
      }

      const user = result.data || result.user;
      const token = result.token;

      if (!user) {
        throw new Error('Utilisateur non reçu du serveur');
      }

      if (!token) {
        throw new Error('Token non reçu du serveur');
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur d'inscription");
      }

      const user = result.data || result.user;
      const token = result.token;

      if (!user || !token) {
        throw new Error("Données d'inscription invalides");
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  },

  setToken(token) {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        localStorage.removeItem(USER_KEY);
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setCurrentUser(user) {
    if (user && typeof user === 'object') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },
};

export default authService;