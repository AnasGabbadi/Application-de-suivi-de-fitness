/**
 * API Client avec fetch natif
 */

// Configuration de base
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
class ApiError extends Error {
  constructor(message, statusCode, errors = [], data = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
  }
}

/**
 * Fonction pour gérer le timeout
 */
const fetchWithTimeout = (url, options = {}, timeout = API_CONFIG.timeout) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Délai d\'attente dépassé')), timeout)
    ),
  ]);
};

/**
 * Intercepteur de requête - Ajouter le token JWT
 */
const requestInterceptor = (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Construire l'URL complète
  const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;
  
  // Préparer les headers
  const headers = {
    ...API_CONFIG.headers,
    ...options.headers,
  };
  
  // Ajouter le token si disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Supprimer Content-Type si c'est un FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }
  
  return {
    url: fullUrl,
    options: {
      ...options,
      headers,
    },
  };
};

/**
 * Intercepteur de réponse - Gérer les erreurs globalement
 */
const responseInterceptor = async (response) => {
  // Cloner la réponse pour pouvoir la lire plusieurs fois
  const clonedResponse = response.clone();
  
  try {
    const data = await response.json();
    
    if (!response.ok) {
      const message = data?.message || 'Une erreur est survenue';
      const errors = data?.errors || [];
      
      // ✅ CORRECTION : Ne déconnecter que si c'est vraiment un problème de token
      if (response.status === 401) {
        // Liste des routes où on ne doit PAS déconnecter automatiquement
        const noAutoLogoutRoutes = [
          '/users/account',        // Suppression de compte
          '/users/change-password' // Changement de mot de passe
        ];
        
        // Vérifier si l'URL de la requête contient une de ces routes
        const shouldNotLogout = noAutoLogoutRoutes.some(route => 
          response.url.includes(route)
        );
        
        // Ne déconnecter que si ce n'est pas une de ces routes
        if (!shouldNotLogout) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Rediriger vers login si pas déjà sur cette page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
      
      throw new ApiError(message, response.status, errors, data);
    }
    
    // Retourner directement data (qui contient { success, data, message, count })
    return data;
  } catch (error) {
    // Si ce n'est pas une ApiError, c'est une erreur de parsing JSON
    if (!(error instanceof ApiError)) {
      // Essayer de lire le texte brut
      try {
        const text = await clonedResponse.text();
        throw new ApiError(
          text || 'Erreur de réponse du serveur',
          response.status,
          [],
          { rawResponse: text }
        );
      } catch {
        throw new ApiError(
          'Réponse invalide du serveur',
          response.status
        );
      }
    }
    throw error;
  }
};

/**
 * Fonction principale pour effectuer des requêtes API
 */
const apiRequest = async (url, options = {}) => {
  try {
    // Appliquer l'intercepteur de requête
    const { url: fullUrl, options: requestOptions } = requestInterceptor(url, options);
    
    // Effectuer la requête avec timeout
    const response = await fetchWithTimeout(fullUrl, requestOptions);
    
    // Appliquer l'intercepteur de réponse
    return await responseInterceptor(response);
  } catch (error) {
    // Gestion des erreurs de réseau
    if (error.message === 'Délai d\'attente dépassé') {
      throw new Error('Le serveur met trop de temps à répondre. Veuillez réessayer.');
    }
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion internet.');
    }
    
    // Propager les autres erreurs
    throw error;
  }
};

/**
 * API Client avec méthodes HTTP
 */
const api = {
  /**
   * GET request
   */
  get: (url, config = {}) => {
    return apiRequest(url, {
      method: 'GET',
      ...config,
    });
  },

  /**
   * POST request
   */
  post: (url, data = null, config = {}) => {
    return apiRequest(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
  },

  /**
   * PUT request
   */
  put: (url, data = null, config = {}) => {
    return apiRequest(url, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
  },

  /**
   * PATCH request
   */
  patch: (url, data = null, config = {}) => {
    return apiRequest(url, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
  },

  /**
   * DELETE request
   */
  delete: (url, data = null, config = {}) => {
    const options = {
      method: 'DELETE',
      ...config,
    };

    // Ajouter le body si des données sont fournies
    if (data) {
      options.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    return apiRequest(url, options);
  },

  /**
   * Upload file
   */
  upload: (url, formData, onProgress = null) => {
    // Note: fetch ne supporte pas nativement le suivi de progression
    // Pour cela, il faudrait utiliser XMLHttpRequest ou une librairie
    return apiRequest(url, {
      method: 'POST',
      body: formData,
    });
  },
};

export default api;
export { ApiError };