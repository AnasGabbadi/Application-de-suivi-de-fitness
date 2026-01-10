import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook pour accéder au contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};

export default useAuth;