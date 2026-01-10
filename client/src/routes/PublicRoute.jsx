import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from '../components/common/Loading';

/**
 * Route publique - redirige vers dashboard si déjà connecté
 * Utilisé pour les pages login/register
 */
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // IMPORTANT: Afficher loader pendant la vérification initiale
  if (loading) {
    return <Loading fullScreen message="Vérification..." />;
  }

  // Rediriger SEULEMENT si vraiment authentifié ET pas en train de charger
  if (isAuthenticated && !loading) {
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;